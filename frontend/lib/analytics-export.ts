export interface AnalyticsSummary {
  totalImpressions: string;
  impressionsGrowth: string;
  avgEngagementRate: string;
  engagementGrowth: string;
  linkClicks: string;
  clicksGrowth: string;
  audienceGrowth: string;
  followersGrowth: string;
}

export interface TopPost {
  id: string;
  title: string;
  platform: string;
  impressions: string;
  engagementRate: string;
  likes: number;
  shares: number;
}

export function exportAnalyticsCSV(metrics: AnalyticsSummary, posts: TopPost[]) {
  const dateStr = new Date().toISOString().split('T')[0];
  
  let csvContent = 'SOCIALFLOW ANALYTICS REPORT\n';
  csvContent += `Generated Date,${dateStr}\n\n`;

  // Summary Metrics Section
  csvContent += 'KEY PERFORMANCE METRICS\n';
  csvContent += 'Metric,Value,Growth / Benchmark\n';
  csvContent += `"Total Impressions","${metrics.totalImpressions}","${metrics.impressionsGrowth}"\n`;
  csvContent += `"Avg Engagement Rate","${metrics.avgEngagementRate}","${metrics.engagementGrowth}"\n`;
  csvContent += `"Link Clicks","${metrics.linkClicks}","${metrics.clicksGrowth}"\n`;
  csvContent += `"Net Audience Growth","${metrics.audienceGrowth}","${metrics.followersGrowth}"\n\n`;

  // Top Performing Content Section
  csvContent += 'TOP PERFORMING CONTENT\n';
  csvContent += 'Post ID,Content Title,Platforms,Impressions,Engagement Rate,Likes,Shares\n';
  posts.forEach((p) => {
    const escapedTitle = p.title.replace(/"/g, '""');
    csvContent += `"${p.id}","${escapedTitle}","${p.platform}","${p.impressions}","${p.engagementRate}",${p.likes},${p.shares}\n`;
  });

  // Daily Engagement Breakdown Data
  csvContent += '\nDAILY ENGAGEMENT BREAKDOWN (PAST 7 DAYS)\n';
  csvContent += 'Day,X (Twitter),Instagram,Facebook,LinkedIn\n';
  csvContent += 'Mon,420,680,210,340\n';
  csvContent += 'Tue,510,740,290,410\n';
  csvContent += 'Wed,620,890,320,490\n';
  csvContent += 'Thu,580,810,310,460\n';
  csvContent += 'Fri,740,950,410,580\n';
  csvContent += 'Sat,890,1120,480,620\n';
  csvContent += 'Sun,950,1280,530,710\n';

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SocialFlow_Analytics_Report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintPDF() {
  window.print();
}
