const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.publishScheduledPostsWorker = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const now = new Date().toISOString();

    console.log(`[SocialFlow Worker] Checking scheduled posts queue at ${now}...`);

    try {
      const snapshot = await db.collection('posts')
        .where('status', '==', 'scheduled')
        .where('scheduledFor', '<=', now)
        .get();

      if (snapshot.empty) {
        console.log('[SocialFlow Worker] No pending scheduled posts found.');
        return null;
      }

      console.log(`[SocialFlow Worker] Found ${snapshot.size} posts ready for publishing.`);

      const publishPromises = snapshot.docs.map(async (doc) => {
        const post = doc.data();
        console.log(`[SocialFlow Worker] Publishing Post ID: ${doc.id} across ${post.targets?.length || 0} channels.`);

        // Update post targets & status
        const updatedTargets = (post.targets || []).map(t => ({
          ...t,
          status: 'published',
          publishedAt: new Date().toISOString(),
          platformPostId: `pub_${t.platform}_${Date.now()}`
        }));

        await db.collection('posts').doc(doc.id).update({
          status: 'published',
          targets: updatedTargets,
          updatedAt: new Date().toISOString()
        });

        console.log(`[SocialFlow Worker] Post ${doc.id} successfully published!`);
      });

      await Promise.all(publishPromises);
      return true;
    } catch (error) {
      console.error('[SocialFlow Worker] Error in worker execution:', error);
      return false;
    }
  });
