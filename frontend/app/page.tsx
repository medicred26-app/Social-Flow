'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Share2, 
  BarChart3, 
  Calendar, 
  HelpCircle, 
  Mail, 
  Send, 
  ChevronDown, 
  Key, 
  User, 
  Sun, 
  Moon,
  LayoutGrid,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function PublicLandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Feature Spotlight Modal state
  const [activeFeatureModal, setActiveFeatureModal] = useState<{
    title: string;
    description: string;
    icon: any;
    details: string[];
    actionRoute: string;
  } | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setContactSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setContactSent(false);
    }, 3000);
  };

  const FAQS = [
    {
      q: 'How do I sign in using my Google Account?',
      a: 'Simply click "Sign in with Google" on the Sign In page. A Google account chooser window will pop up to securely authenticate your profile.'
    },
    {
      q: 'How does automated scheduled publishing work?',
      a: 'SocialFlow runs a dedicated Express backend API worker that continuously monitors your queued posts and publishes them across your connected social platforms at the exact scheduled time.'
    },
    {
      q: 'Which social platforms are supported?',
      a: 'SocialFlow supports Facebook Pages, Instagram Business, YouTube Channels, LinkedIn Company Profiles, and X (Twitter) Accounts.'
    },
    {
      q: 'Is my social media account data secure?',
      a: 'Yes, SocialFlow uses enterprise-grade OAuth 2.0 authentication tokens and HTTPS encryption across all API requests.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Banner for Logged-In Users */}
      {user && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs py-2.5 px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
          <Link
            href="/dashboard"
            className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-all inline-flex items-center gap-1"
          >
            <span>Go to Workspace Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Public Header */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800/80 px-6 md:px-12 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
            SocialFlow
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
          <a href="#help" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help & FAQ</a>
          <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="interactive-section relative py-20 px-6 md:px-12 text-center max-w-5xl mx-auto space-y-8 rounded-3xl my-4">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Express Backend Server & Google OAuth Ready</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Automate & Scale Your Social Media Operations
        </h1>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Schedule posts, compose content with AI assistance, and analyze engagement metrics across Facebook, Instagram, YouTube, LinkedIn, and X from a unified workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Go to Workspace Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/compose"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Create New Post</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Key className="w-4 h-4 text-indigo-500" />
                <span>Sign In with Google</span>
              </Link>
            </>
          )}
        </div>

        {/* Platform Icons Badge */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Facebook</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instagram</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> YouTube</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> LinkedIn</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> X (Twitter)</span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="interactive-section py-16 px-6 md:px-12 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              About SocialFlow
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              SocialFlow is a modern multi-platform social media scheduling suite built for creators, marketers, and teams to automate queue management. Click any section below for live details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setActiveFeatureModal({
                title: 'Multi-Channel Hub',
                description: 'Manage all connected profiles in a single command center with zero tab switching.',
                icon: Share2,
                details: [
                  'Support for X (Twitter), LinkedIn, Instagram, Facebook & YouTube',
                  'Individual and multi-select account targeting',
                  'Live OAuth 2.0 connection state monitoring'
                ],
                actionRoute: '/accounts'
              })}
              className="interactive-card cursor-pointer p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Multi-Channel Hub</span>
                <span className="text-xs text-indigo-500 font-normal">View →</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect and manage all your brand channels simultaneously without logging into multiple platforms.
              </p>
            </div>

            <div
              onClick={() => setActiveFeatureModal({
                title: 'Express Backend Worker',
                description: 'Dedicated Express Node.js API background worker driving real-time publishing.',
                icon: Zap,
                details: [
                  'Runs automated scheduled checks on http://localhost:5000',
                  'REST endpoints for auth, posts, accounts, and analytics',
                  'Auto-transitions past scheduled items to published state'
                ],
                actionRoute: '/dashboard'
              })}
              className="interactive-card cursor-pointer p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Express Backend Worker</span>
                <span className="text-xs text-purple-500 font-normal">View →</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Powered by an Express API server running continuous queue checks to publish scheduled posts smoothly.
              </p>
            </div>

            <div
              onClick={() => setActiveFeatureModal({
                title: 'Google OAuth Security',
                description: 'Official Google Identity Services integration with custom client ID support.',
                icon: Key,
                details: [
                  'One-click popup Google Account chooser',
                  'Seamless backend token verification',
                  'Configurable Client ID setting in workspace settings'
                ],
                actionRoute: '/login'
              })}
              className="interactive-card cursor-pointer p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Google OAuth Security</span>
                <span className="text-xs text-pink-500 font-normal">View →</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Supports official Google Identity Services OAuth 2.0 authentication with custom Google Cloud Client ID configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="interactive-section py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Powerful Platform Features
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Click on any feature card to view its live demonstration preview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => setActiveFeatureModal({
              title: 'Visual Calendar',
              description: 'Interactive monthly and weekly post scheduling calendar.',
              icon: Calendar,
              details: [
                'Grid layout with month & week view modes',
                'Color-coded target platform badges',
                'One-click post edit & delete controls'
              ],
              actionRoute: '/calendar'
            })}
            className="interactive-card cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <Calendar className="w-6 h-6 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Visual Calendar</span>
              <span className="text-[10px] text-indigo-500">Preview</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">View upcoming scheduled posts in monthly and weekly grid calendars.</p>
          </div>

          <div
            onClick={() => setActiveFeatureModal({
              title: 'Real-Time Analytics',
              description: 'Comprehensive performance metrics and engagement rate visualization.',
              icon: BarChart3,
              details: [
                'Impressions, clicks, and engagement charts',
                'Platform performance breakdown bars',
                'Historical engagement timeline trends'
              ],
              actionRoute: '/analytics'
            })}
            className="interactive-card cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Real-Time Analytics</span>
              <span className="text-[10px] text-purple-500">Preview</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track total impressions, engagement rates, clicks, and follower growth.</p>
          </div>

          <div
            onClick={() => setActiveFeatureModal({
              title: 'AI Content Composer',
              description: 'AI-assisted caption creator with real-time character limit enforcement.',
              icon: Sparkles,
              details: [
                'Automated hashtag generator',
                'Platform-specific limit validation (X, LinkedIn, IG)',
                'Image & media attachment previewer'
              ],
              actionRoute: '/compose'
            })}
            className="interactive-card cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <Sparkles className="w-6 h-6 text-pink-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>AI Content Composer</span>
              <span className="text-[10px] text-pink-500">Preview</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Compose engaging captions with real-time platform character counters.</p>
          </div>

          <div
            onClick={() => setActiveFeatureModal({
              title: 'Glassmorphism Custom Cursor',
              description: 'Next-gen fluid cursor tracking with frosted glass aura rings.',
              icon: ShieldCheck,
              details: [
                'Hardware-accelerated transform interpolation',
                'Interactive target ring morphing over clickable elements',
                'Custom dark & light theme glowing trail'
              ],
              actionRoute: '#'
            })}
            className="interactive-card cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Glassmorphism UI</span>
              <span className="text-[10px] text-emerald-500">Preview</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Custom precision pointer with backdrop blur glass effects.</p>
          </div>
        </div>
      </section>

      {/* Help & FAQ Section */}
      <section id="help" className="py-16 px-6 md:px-12 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Help & Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Find quick answers on setting up Google Auth, backend API workers, and scheduled publishing.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 font-semibold text-xs md:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact Support & Enquiries
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Have questions or need assistance? Send us a message and our team will respond shortly.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          {contactSent && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! Your message has been sent to support@socialflow.app.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@socialflow.app"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="Question about Google OAuth Client ID setup"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Type your question or support request here..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">SocialFlow</span>
            <span>© 2026 SocialFlow Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:underline">About</a>
            <a href="#features" className="hover:underline">Features</a>
            <a href="#help" className="hover:underline">Help & FAQ</a>
            <a href="#contact" className="hover:underline">Contact</a>
            {user ? (
              <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign In</Link>
            )}
          </div>
        </div>
      </footer>

      {/* Interactive Feature Spotlight Modal */}
      {activeFeatureModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <activeFeatureModal.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeFeatureModal.title}
                </h3>
                <span className="text-xs text-indigo-500 font-medium">Interactive Spotlight</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeFeatureModal.description}
            </p>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                Key Capabilities:
              </span>
              {activeFeatureModal.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close Preview
              </button>
              {activeFeatureModal.actionRoute !== '#' && (
                <Link
                  href={activeFeatureModal.actionRoute}
                  onClick={() => setActiveFeatureModal(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all inline-flex items-center gap-1.5"
                >
                  <span>Open Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

