/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { 
  Puzzle, 
  Users, 
  Users2,
  MessageSquare, 
  Flag, 
  Key, 
  Globe, 
  Globe2,
  Search, 
  Cpu, 
  Github,
  Linkedin, 
  Instagram, 
  Disc, 
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Menu,
  X,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  Gamepad2,
  Code2,
  ClipboardCheck,
  GraduationCap,
  Lock,
  ArrowRight
} from 'lucide-react';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { parseContentImageList, renderObsidianEmbeds, resolveContentAsset } from './lib/contentAssets';
import { useTheme } from './context/ThemeContext.tsx';
import { GlitchText, CircuitLines, GlitchOverlay, DigitalMapBackground } from './components/CyberEffects';

// Import markdown content as raw strings
import heroContent from './content/hero.md?raw';
import aboutContent from './content/about.md?raw';

const loadCollection = (glob: Record<string, any>) => {
  return Object.entries(glob).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([path, content], index) => {
    const { data, content: text } = matter(content);
    return { ...data, order: data.order ?? index + 1, sourcePath: path, content: text };
  });
};

const servicesGlob = import.meta.glob('./content/services/*.md', { eager: true, query: '?raw', import: 'default' });
const achievementsGlob = import.meta.glob('./content/achievements/*.md', { eager: true, query: '?raw', import: 'default' });
const teamGlob = import.meta.glob('./content/team/*.md', { eager: true, query: '?raw', import: 'default' });
const projectsGlob = import.meta.glob('./content/projects/*.md', { eager: true, query: '?raw', import: 'default' });
const galleryGlob = import.meta.glob('./content/gallery/*.md', { eager: true, query: '?raw', import: 'default' });
const connectGlob = import.meta.glob('./content/connect/*.md', { eager: true, query: '?raw', import: 'default' });

const IconMap: Record<string, React.ReactNode> = {
  Puzzle: <Puzzle size={32} />,
  Users: <Users size={32} />,
  MessageSquare: <MessageSquare size={32} />,
  Flag: <Flag size={32} />,
  Key: <Key size={40} />,
  Globe: <Globe size={40} />,
  Search: <Search size={40} />,
  Cpu: <Cpu size={40} />,
  Linkedin: <Linkedin size={32} />,
  Instagram: <Instagram size={32} />,
  Disc: <Disc size={32} />,
  Github: <Github size={32} />
};

const ConnectIcon = ({ icon }: { icon?: string }) => {
  if (icon && IconMap[icon]) {
    return IconMap[icon];
  }

  const iconUrl = resolveContentAsset(icon);
  if (iconUrl && iconUrl !== icon) {
    return (
      <span
        className="block w-8 h-8 bg-current"
        style={{
          WebkitMask: `url("${iconUrl}") center / contain no-repeat`,
          mask: `url("${iconUrl}") center / contain no-repeat`,
        }}
      />
    );
  }

  return <ExternalLink size={32} />;
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="min-h-[calc(100vh-80px)] flex flex-col pt-24 pb-12 px-6 md:px-12 w-full"
  >
    {children}
  </motion.div>
);

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-black/20 backdrop-blur-sm p-1 rounded-full border border-white/10 ml-4">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-1.5 rounded-full transition-all",
          theme === 'light' ? "bg-cyber-red text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "text-gray-400 hover:text-white"
        )}
        title="Light Mode"
      >
        <Sun size={12} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-1.5 rounded-full transition-all",
          theme === 'dark' ? "bg-cyber-red text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "text-gray-400 hover:text-white"
        )}
        title="Dark Mode"
      >
        <Moon size={12} />
      </button>
      <button
        onClick={() => setTheme('glass')}
        className={cn(
          "p-1.5 rounded-full transition-all",
          theme === 'glass' ? "bg-cyber-red text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "text-gray-400 hover:text-white"
        )}
        title="Glass Mode"
      >
        <Sparkles size={12} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Connect', path: '/connect' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300",
      theme === 'glass' ? "bg-black/20 backdrop-blur-xl border-b border-white/10" : "bg-[var(--bg-title)]/90 backdrop-blur-md border-b border-cyber-red/30"
    )}>
      <div className="w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={TEAM_LOGO_URL} alt="RAB" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
          <span className="font-orbitron font-bold text-[var(--text-main)] tracking-tighter text-xl">RAB</span>
        </Link>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-8 text-[10px] font-orbitron tracking-[0.2em] uppercase mr-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "transition-colors duration-200",
                  location.pathname === item.path ? "text-cyber-red" : "text-[var(--text-muted)] hover:text-cyber-red"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <motion.button 
              onClick={() => window.location.href = 'mailto:smshahrieremon@gmail.com'}
              className="px-4 py-1.5 border border-cyber-red/50 text-[10px] font-orbitron tracking-widest uppercase text-cyber-red hover:bg-cyber-red hover:text-white transition-all rounded"
              whileHover={{ boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}
            >
              Contact Us
            </motion.button>
            <ThemeToggle />
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--text-muted)] hover:text-cyber-red transition-colors">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--bg-title)]/95 backdrop-blur-lg border-t border-cyber-red/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs font-orbitron tracking-widest uppercase",
                    location.pathname === item.path ? "text-cyber-red" : "text-[var(--text-muted)]"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 text-center md:text-left">
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-orbitron font-bold text-[var(--text-main)] tracking-widest uppercase"
    >
      {title}
    </motion.h2>
    <div className="w-24 h-1 bg-cyber-red mt-4 mb-6" />
    {subtitle && <p className="text-[var(--text-muted)] max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      img: ({ node: _node, ...props }) => (
        <img
          {...props}
          className="my-6 rounded-lg border border-cyber-border shadow-xl"
          loading="lazy"
        />
      )
    }}
  >
    {renderObsidianEmbeds(content)}
  </ReactMarkdown>
);

const splitAboutContent = (content: string) => {
  const missionHeading = content.match(/^###\s+Our Mission\s*$/mi);
  if (!missionHeading || missionHeading.index === undefined) {
    return { intro: content, mission: '', remainder: '' };
  }

  const intro = content.slice(0, missionHeading.index).trim();
  const afterMissionHeading = content.slice(missionHeading.index + missionHeading[0].length).trim();
  const nextHeading = afterMissionHeading.search(/^###\s+/mi);

  if (nextHeading === -1) {
    return { intro, mission: afterMissionHeading, remainder: '' };
  }

  return {
    intro,
    mission: afterMissionHeading.slice(0, nextHeading).trim(),
    remainder: afterMissionHeading.slice(nextHeading).trim(),
  };
};

const TEAM_LOGO_URL = "https://i.postimg.cc/HnsyRTB5/Picsart-25-07-29-01-21-44-004.png";
const CTFTIME_LOGO_URL = "https://i.postimg.cc/8k69zWBT/download.png";
const FALLBACK_TEAM_STATS = {
  name: 'Rea11y Annoying Bots(RAB)',
  country: 'BD',
  countryName: 'BANGLADESH',
  globalRank: 42,
  countryRank: 2,
  rating: '365.87 pts',
  activeSince: '2017'
};

const mapCtftimeStats = (stats: any) => {
  const currentYear = new Date().getFullYear();
  const yearStats = stats.rating?.[currentYear] || stats.rating?.[currentYear - 1] || {};
  const countryMap: Record<string, string> = {
    'BD': 'BANGLADESH',
    'CO': 'COLOMBIA',
    'US': 'UNITED STATES'
  };

  return {
    name: stats.name || FALLBACK_TEAM_STATS.name,
    country: stats.country || FALLBACK_TEAM_STATS.country,
    countryName: countryMap[stats.country] || stats.country || FALLBACK_TEAM_STATS.countryName,
    globalRank: yearStats.rating_place || 'N/A',
    countryRank: yearStats.country_place || 'N/A',
    rating: yearStats.rating_points ? `${yearStats.rating_points.toFixed(2)} pts` : 'N/A',
    activeSince: Object.keys(stats.rating || {})
      .filter(year => Object.keys(stats.rating[year] || {}).length > 0)
      .sort()[0] || FALLBACK_TEAM_STATS.activeSince
  };
};

// Page Components
const HomePage = ({ heroData }: { heroData: any }) => {
  const [teamStats, setTeamStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract team ID from hero content
  const teamIdMatch = heroData.content.match(/ctftime\.org\/team\/(\d+)/);
  const teamId = teamIdMatch ? teamIdMatch[1] : null;

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const apiResponse = await fetch(`/api/team-stats/${teamId}`);
        if (apiResponse.ok) {
          const stats = await apiResponse.json();
          setTeamStats(mapCtftimeStats(stats));
          return;
        }

        const staticResponse = await fetch('/team-stats.json');
        if (staticResponse.ok) {
          setTeamStats(await staticResponse.json());
          return;
        }

        setTeamStats(FALLBACK_TEAM_STATS);
      } catch (error) {
        setTeamStats(FALLBACK_TEAM_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [teamId]);

  return (
    <PageWrapper>
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 0.8, opacity: 0.06 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={TEAM_LOGO_URL} 
            alt="" 
            className="w-[80vw] max-w-[800px] h-auto object-contain"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-8">
          <GlitchText 
            text="Rea11y Annoying Bots" 
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-orbitron font-bold tracking-tighter text-[var(--text-main)] whitespace-nowrap"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl md:text-3xl font-orbitron text-cyber-red tracking-[0.4em]"
          >
            RAB ELITE CYBERSECURITY
          </motion.p>
          
          <motion.div className="text-[var(--text-muted)] max-w-2xl mx-auto text-base leading-relaxed prose prose-invert">
            <MarkdownContent content={heroData.content} />
          </motion.div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <motion.div className="relative group">
              <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-2 translate-y-1 opacity-50 z-0 group-hover:border-cyber-red/20 transition-all pointer-events-none" />
              <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 shadow-2xl glass-morphism pointer-events-none" />
              
              <div className="relative z-20 p-8 flex flex-col items-start text-left h-full">
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="bg-cyber-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                      {loading ? '...' : `#${teamStats?.countryRank || '---'} IN ${teamStats?.country || 'UNSET'}`}
                    </span>
                    <p className="text-[var(--text-main)] font-orbitron text-xs font-bold tracking-[0.2em]">
                      {loading ? 'LOADING INTEL...' : `${teamStats?.countryName || 'UNSET'} SECTOR`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="group-hover:scale-110 transition-transform bg-white/5 p-1 rounded">
                      <img src={CTFTIME_LOGO_URL} alt="CTFtime" className="h-8 object-contain" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 w-full">
                  {[
                    { label: 'Global Rank', value: loading ? '...' : `#${teamStats?.globalRank || '---'}`, icon: '🌐' },
                    { label: 'Rating', value: loading ? '...' : (teamStats?.rating || '0.00 pts'), icon: '📈' },
                    { label: 'Active Since', value: loading ? '...' : (teamStats?.activeSince || '2026'), icon: '📅' }
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <span className="w-8 text-lg grayscale opacity-70">{stat.icon}</span>
                      <div className="flex-1">
                        <p className="uppercase text-[8px] text-[var(--text-muted)] font-bold tracking-wider">{stat.label}</p>
                        <p className="text-[var(--text-main)] font-bold text-base">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
    
            <div className="grid grid-rows-2 gap-4">
              <Link to="/about" className="relative group">
                <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-1 translate-y-0.5 opacity-50 z-0 group-hover:border-cyber-red/20 transition-all" />
                <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 shadow-xl glass-morphism" />
                <div className="relative z-20 p-6 flex items-center justify-center h-full text-center">
                  <div>
                    <h3 className="text-[var(--text-main)] font-orbitron font-bold text-lg mb-1 group-hover:text-cyber-red transition-colors">ABOUT_US</h3>
                    <p className="text-[var(--text-muted)] text-[10px] uppercase font-mono tracking-widest">Decript mission & core values</p>
                  </div>
                  <ChevronRight className="absolute right-6 text-cyber-red opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </Link>
    
              <Link to="/achievements" className="relative group">
                <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-1 translate-y-0.5 opacity-50 z-0 group-hover:border-cyber-red/20 transition-all" />
                <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 shadow-xl glass-morphism" />
                <div className="relative z-20 p-6 flex items-center justify-center h-full text-center">
                  <div>
                    <h3 className="text-[var(--text-main)] font-orbitron font-bold text-lg mb-1 group-hover:text-cyber-red transition-colors">ACHIEVEMENTS</h3>
                    <p className="text-[var(--text-muted)] text-[10px] uppercase font-mono tracking-widest">Access victory records</p>
                  </div>
                  <ChevronRight className="absolute right-6 text-cyber-red opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const AchievementsPage = ({ achievements }: { achievements: any[] }) => {
  const years = [2026, 2025];
  const categories = ['Inter University', 'National', 'International'];
  
  return (
    <PageWrapper>
      <SectionHeader 
        title="Achievements" 
        subtitle="Operational success logs. Accessing decrypted victory records from the neural database." 
      />
      
      <div className="space-y-24 mt-8">
        {years.map((year) => {
          const yearAchievements = achievements.filter(a => Number(a.year) === year);
          if (yearAchievements.length === 0) return null;

          return (
            <div key={year} className="relative">
              {/* Year Header */}
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-4xl font-orbitron font-black text-[var(--text-main)] opacity-10 select-none">{year}</h3>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-cyber-red/50 to-transparent" />
                <div className="text-cyber-red font-mono text-xs tracking-widest uppercase bg-cyber-red/5 px-4 py-1 border border-cyber-red/20 rounded">
                  Yearly_Log_v{year}
                </div>
              </div>

              <div className="space-y-12">
                {categories.map((category) => {
                  const catAchievements = yearAchievements.filter(a => a.category === category);
                  if (catAchievements.length === 0) return null;

                  return (
                    <div key={`${year}-${category}`} className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-cyber-border" />
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyber-red rounded-full animate-pulse" />
                          <h4 className="text-[var(--text-main)] font-orbitron text-xs font-bold uppercase tracking-[0.2em]">{category}</h4>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">[{catAchievements.length}_RECORDS]</span>
                        </div>
                        <div className="h-px flex-1 bg-cyber-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {catAchievements.map((ctf, idx) => (
                          <motion.div 
                            key={`${ctf.name}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group min-h-[160px] flex flex-col transition-all"
                          >
                            {/* The Offset "Shadow" Layer */}
                            <div className="absolute inset-0 border border-cyber-border skew-x-[-6deg] -translate-x-2 translate-y-1 opacity-50 group-hover:border-cyber-red/20 transition-all pointer-events-none" />
                            
                            {/* The Main Surface Layer */}
                            <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-6deg] group-hover:border-cyber-red/40 transition-all shadow-2xl pointer-events-none glass-morphism" />

                            {/* Watermark Rank - Higher Opacity */}
                            <div className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl font-orbitron font-black text-[var(--text-main)] opacity-[0.08] select-none pointer-events-none group-hover:text-cyber-red/20 transition-all duration-700 group-hover:scale-125 uppercase italic z-0 tracking-tighter">
                              {ctf.rank ? ctf.rank.split(' ')[0].replace(/[(),#]/g, '') : ''}
                            </div>

                            {/* Scanning line effect on hover - Skewed to match */}
                            <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-cyber-red/10 to-transparent -translate-y-full group-hover:translate-y-[200%] transition-transform duration-1000 ease-in-out pointer-events-none skew-x-[-6deg]" />
                            
                            {/* Content Wrapper - Relative to sit above layers */}
                            <div className="relative z-30 p-6 flex flex-col justify-between h-full">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 min-w-0 pr-24">
                                  <h5 className="text-[var(--text-main)] text-base font-bold truncate group-hover:text-cyber-red transition-colors font-orbitron whitespace-normal">{ctf.name}</h5>
                                  <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase mt-0.5">{ctf.year}</p>
                                </div>
                                <div className="absolute top-4 right-4 z-40 flex justify-end">
                                  <span className={cn(
                                    "text-[7px] font-bold px-1.5 py-1 rounded-sm border leading-tight block font-orbitron bg-cyber-red text-white border-cyber-red shadow-[0_0_8px_rgba(239,68,68,0.4)] text-center max-w-[75px]"
                                  )}>
                                    {ctf.rank}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="space-y-4">
                                  {ctf.issuedBy && (
                                    <div>
                                      <p className="text-[8px] text-[var(--text-muted)] uppercase font-black mb-1">Issued By</p>
                                      <p className="text-[var(--text-main)] font-mono text-[9px] uppercase">{ctf.issuedBy}</p>
                                    </div>
                                  )}
                                  {ctf.content && (
                                    <div className="pl-3 border-l border-cyber-red/20">
                                      <p className="text-[9px] text-[var(--text-muted)] italic leading-relaxed line-clamp-2">
                                        {ctf.content}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink size={12} className="text-cyber-red" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

const AboutPage = ({ aboutData }: { aboutData: any }) => {
  const navigate = useNavigate();
  const aboutSections = splitAboutContent(aboutData.content);
  const aboutImages = parseContentImageList(aboutData.data.images || aboutData.data.aboutImages);
  const introImage = aboutImages[0] || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000";
  const missionImage = aboutImages[1] || aboutImages[0] || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000";
  
  const values = [
    { 
      title: 'Research-First', 
      desc: 'We bridge offensive testing with practical, real-world defense to advance security.',
      icon: <FlaskConical size={24} className="text-cyber-red" />
    },
    { 
      title: 'CTF Heritage', 
      desc: 'Competitive roots shape our rigor, teamwork, and calm execution under pressure.',
      icon: <Gamepad2 size={24} className="text-cyber-red" />
    },
    { 
      title: 'Open-Source Mindset', 
      desc: 'We build and share tools the community can use, extend, and learn from.',
      icon: <Code2 size={24} className="text-cyber-red" />
    },
    { 
      title: 'Responsible Disclosure', 
      desc: 'Evidence-based findings with reproducible PoCs and coordinated disclosure.',
      icon: <ShieldCheck size={24} className="text-cyber-red" />
    },
    { 
      title: 'Clear Outcomes', 
      desc: 'Reports that map directly to actions—prioritized risks and practical remediation.',
      icon: <ClipboardCheck size={24} className="text-cyber-red" />
    },
    { 
      title: 'Culture of Growth', 
      desc: 'Feedback, mentorship, and continuous learning by default.',
      icon: <GraduationCap size={24} className="text-cyber-red" />
    },
    { 
      title: 'Collaboration by Design', 
      desc: 'Cross-disciplinary work across Web/AppSec, RE, OSINT, Crypto, and DFIR.',
      icon: <Users2 size={24} className="text-cyber-red" />
    },
    { 
      title: 'Community Impact', 
      desc: 'Active locally and globally through competitions, education, and open resources.',
      icon: <Globe2 size={24} className="text-cyber-red" />
    },
    { 
      title: 'Privacy & Ethics', 
      desc: 'Lawful research and careful handling of sensitive data—trust by design.',
      icon: <Lock size={24} className="text-cyber-red" />
    }
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <div className="relative mb-32 pt-12 pb-24 overflow-hidden">
        {/* Background circular logo decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none -z-10">
          <img src={TEAM_LOGO_URL} alt="" className="w-full h-full object-contain grayscale" />
        </div>

        <div className="text-center w-full space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-orbitron font-black text-[var(--text-main)] tracking-widest uppercase">
              {aboutData.data.title || 'About Us'}
            </h1>
            <div className="w-16 h-1 bg-cyber-red mx-auto" />
            <p className="text-[var(--text-muted)] text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              {aboutData.data.subtitle || 'We combine CTF experience with offensive security research and vulnerability disclosure to uncover flaws, build tools, and strengthen cybersecurity.'}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/achievements')}
            className="inline-flex items-center gap-2 bg-cyber-red text-white font-orbitron font-bold text-sm px-8 py-3 rounded-full hover:bg-cyber-red/90 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] group"
          >
            Achievements <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      <div className="w-full space-y-32">
        {/* Markdown Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <h2 className="text-3xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wider">{aboutData.data.title || 'About Us'}</h2>
              <div className="w-12 h-1 bg-cyber-red mt-2" />
            </div>
            
            <div className="prose prose-invert max-w-none prose-sm text-[var(--text-muted)] leading-relaxed">
              <MarkdownContent content={aboutSections.intro} />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-cyber-red -rotate-1 skew-x-3 group-hover:rotate-0 group-hover:skew-x-0 transition-all duration-500" />
            <div className="relative aspect-[4/3] overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-cyber-red/50 transition-all duration-500">
              <img 
                src={introImage} 
                alt="Our Team" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </section>

        {aboutSections.mission && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute inset-0 bg-cyber-red rotate-1 skew-x-[-3deg] group-hover:rotate-0 group-hover:skew-x-0 transition-all duration-500" />
              <div className="relative aspect-[4/3] overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-cyber-red/50 transition-all duration-500">
                <img 
                  src={missionImage} 
                  alt="Our Mission" 
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-block">
                <h2 className="text-3xl font-orbitron font-bold text-[var(--text-main)] uppercase tracking-wider">Our Mission</h2>
                <div className="w-12 h-1 bg-cyber-red mt-2" />
              </div>
              
              <div className="prose prose-invert max-w-none prose-sm text-[var(--text-muted)] leading-relaxed">
                <MarkdownContent content={aboutSections.mission} />
              </div>
            </div>
          </section>
        )}

        {aboutSections.remainder && (
          <section className="space-y-8 max-w-4xl">
            <div className="prose prose-invert max-w-none prose-sm text-[var(--text-muted)] leading-relaxed">
              <MarkdownContent content={aboutSections.remainder} />
            </div>
          </section>
        )}

        {/* Values Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-12">
          {values.map((value, idx) => (
            <motion.div 
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="space-y-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-red/10 rounded-lg group-hover:bg-cyber-red/20 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-lg font-orbitron font-bold text-[var(--text-main)] group-hover:text-cyber-red transition-colors">
                  {value.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed pl-13">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </PageWrapper>
  );
};

const ServicesPage = ({ services }: { services: any[] }) => (
  <PageWrapper>
    <SectionHeader title="System Capabilities" subtitle="What we bring to the digital battlefield. Specialized services for modern threat landscapes." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {services.map((service, idx) => (
        <motion.div 
          key={`${service.title}-${idx}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group min-h-[200px] flex flex-col transition-all"
        >
          {/* Layers */}
          <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-2 translate-y-1 opacity-50 z-0 pointer-events-none group-hover:border-cyber-red/20 transition-all" />
          <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 pointer-events-none shadow-2xl glass-morphism" />
          <div className="absolute top-0 left-0 w-2 h-12 bg-cyber-red/40 skew-x-[-4deg] z-20 group-hover:bg-cyber-red transition-all" />
          
          <div className="relative z-30 p-8 flex flex-col items-center text-center md:items-start md:text-left h-full">
            <div className="text-cyber-red mb-4 p-3 bg-cyber-red/5 rounded-full group-hover:scale-110 group-hover:bg-cyber-red/10 transition-all">
              {IconMap[service.icon as string]}
            </div>
            <h3 className="text-[var(--text-main)] font-bold text-xl mb-3 font-orbitron tracking-tight group-hover:text-cyber-red transition-colors">{service.title}</h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">{service.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </PageWrapper>
);

const ProjectsPage = ({ projects }: { projects: any[] }) => (
  <PageWrapper>
    <SectionHeader title="Operational Portfolio" subtitle="Decrypted records of our specialized engagements and ongoing initiatives." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, idx) => {
        const projectId = project.title ? encodeURIComponent(project.title.toLowerCase().replace(/\s+/g, '-')) : `project-${idx}`;
        return (
          <motion.div 
            key={`${project.title}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-2 translate-y-1 opacity-50 z-0 pointer-events-none group-hover:border-cyber-red/20 transition-all" />
            <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 pointer-events-none shadow-2xl glass-morphism" />
            
            <Link to={`/projects/${projectId}`} className="relative z-20 block overflow-hidden rounded-lg m-1 border border-cyber-border hover:border-cyber-red/50 transition-all">
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={resolveContentAsset(project.heroImage)} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 right-4 capitalize text-[10px] font-mono bg-cyber-red text-white px-2 py-1 rounded">
                  {project.status}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-cyber-red uppercase tracking-widest">{project.category}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">•</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{project.date}</span>
                </div>
                <h3 className="text-[var(--text-main)] font-orbitron font-bold text-xl mb-2 group-hover:text-cyber-red transition-colors">{project.title}</h3>
                <p className="text-[var(--text-muted)] text-xs line-clamp-2 leading-relaxed">{project.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags?.map((tag: string) => (
                    <span key={tag} className="text-[8px] bg-white/5 border border-white/10 text-[var(--text-muted)] px-2 py-0.5 rounded">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </PageWrapper>
);

const ProjectDetailPage = ({ projects }: { projects: any[] }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const project = projects.find(p => 
    p.title && encodeURIComponent(p.title.toLowerCase().replace(/\s+/g, '-')) === projectId
  );

  if (!project) return <div className="text-[var(--text-main)] p-24 text-center font-orbitron">PROJECT_NOT_FOUND</div>;

  return (
    <PageWrapper>
      <div className="mb-12">
        <button 
          onClick={() => navigate('/projects')}
          className="mb-8 flex items-center gap-2 text-[10px] font-orbitron tracking-widest text-[var(--text-muted)] hover:text-cyber-red transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          BACK_TO_PORTFOLIO
        </button>
        
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-cyber-border bg-cyber-card mb-12 glass-morphism">
          <img src={resolveContentAsset(project.heroImage)} alt={project.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-cyber-red text-white text-[10px] font-mono px-3 py-1 rounded">
                CATEGORY: {project.category.toUpperCase()}
              </span>
              <span className="bg-white/10 text-white text-[10px] font-mono px-3 py-1 rounded border border-white/20 backdrop-blur-md">
                DATE: {project.date}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white tracking-widest uppercase italic shadow-2xl">
              {project.title}
            </h1>
            <p className="text-xl text-cyber-red font-orbitron mt-2 tracking-widest">{project.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 glass-morphism">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-8 border-b border-white/5 pb-4">Operational_Summary</h2>
              <div className="prose prose-invert max-w-none prose-sm text-gray-300 leading-relaxed">
                <MarkdownContent content={project.content} />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 glass-morphism">
              <h3 className="text-xs font-orbitron font-bold text-cyber-red mb-6 tracking-widest uppercase">Metadata_Tags</h3>
              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tag: string) => (
                  <span key={tag} className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-xs font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 glass-morphism">
              <h3 className="text-xs font-orbitron font-bold text-cyber-red mb-6 tracking-widest uppercase">Project_Status</h3>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-3 h-3 rounded-full animate-pulse",
                  project.status === 'Completed' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-cyber-red shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                )} />
                <span className="text-white font-orbitron text-sm uppercase tracking-wider">{project.status}</span>
              </div>
            </div>
            
            <motion.button 
              className="w-full py-4 bg-cyber-red/10 border border-cyber-red/50 text-cyber-red font-orbitron text-xs font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-cyber-red hover:text-white transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request_Full_Intel
            </motion.button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const TeamPage = ({ team }: { team: any[] }) => {
  const categories = ["Team Leads", "Core Member", "General Member", "R&D Member", "Advisor"];
  
  return (
    <PageWrapper>
      <SectionHeader 
        title="Tactical Command" 
        subtitle="The elite intelligence behind our operations. Each member is indexed and verified." 
      />
      
      <div className="space-y-20 mt-12">
        {categories.map((category) => {
          const members = team.filter(m => m.category === category);
          if (members.length === 0) return null;
          
          return (
            <div key={category} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-cyber-red" />
                <h2 className="text-[var(--text-main)] font-orbitron font-black text-2xl tracking-widest uppercase italic">
                  {category}
                </h2>
                <div className="h-px flex-1 bg-cyber-border" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((member, idx) => (
                  <motion.div
                    key={`${member.name}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative w-full aspect-video md:aspect-[16/10] group"
                  >
                    {/* Part 1: Info Block (Main - Left/Center) */}
                    <div className="absolute top-4 left-0 w-[82%] h-[80%] z-20">
                      <div className="absolute inset-0 bg-cyber-dark/60 backdrop-blur-md border border-cyber-border skew-x-[-6deg] translate-x-1 translate-y-1 z-0 shadow-2xl" />
                      <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-6deg] z-10 p-5 flex flex-col justify-center group-hover:border-cyber-red/30 transition-all glass-morphism">
                        <div className="mb-2">
                          <h3 className="text-[var(--text-main)] font-orbitron font-bold text-base tracking-tight group-hover:text-cyber-red transition-colors truncate">
                            {member.fullname}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-cyber-red text-[8px] font-mono font-black uppercase tracking-tighter">
                              {member.username}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                          <p className="text-[var(--text-muted)] text-[10px] font-mono font-bold uppercase tracking-widest">
                            {member.role}
                          </p>
                          <div className="flex shrink-0 gap-2">
                            {member.github && (
                              <a
                                href={member.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--text-muted)] hover:text-cyber-red transition-colors"
                                aria-label={`${member.fullname} GitHub`}
                                title="GitHub"
                              >
                                <Github size={14} />
                              </a>
                            )}
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--text-muted)] hover:text-cyber-red transition-colors"
                                aria-label={`${member.fullname} LinkedIn`}
                                title="LinkedIn"
                              >
                                <Linkedin size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Part 2: Photo Block (Accent - Overlapping Right) */}
                    <div className="absolute top-0 right-0 w-[40%] h-full z-30">
                      <div className="absolute inset-0 bg-cyber-red border border-cyber-red/50 skew-x-[-6deg] translate-x-1 translate-y-1 z-0 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all" />
                      <div className="absolute inset-0 bg-[#111] border border-white/20 skew-x-[-6deg] z-10 overflow-hidden group-hover:border-white transition-colors">
                        <img 
                          src={resolveContentAsset(member.image)} 
                          alt={member.fullname} 
                          className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-125"
                        />
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-4 w-4 h-1 bg-cyber-red/40 z-40 group-hover:bg-cyber-red transition-all" />
                    <div className="absolute -bottom-2 right-12 text-[6px] font-mono text-white/5 group-hover:text-cyber-red/40 transition-all uppercase tracking-widest">
                      // ID:{member.name.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

const GalleryPage = ({ photos }: { photos: any[] }) => (
  <PageWrapper>
    <SectionHeader 
      title="Field Records" 
      subtitle="Visual capture of operational hubs and field events. Secured memories from the front lines." 
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
      {photos.map((item, idx) => {
        const imageList = parseContentImageList(item.images);
        const coverImage = imageList[0];
        const eventId = encodeURIComponent(item.event.toLowerCase().replace(/\s+/g, '-'));

        return (
          <motion.div 
            key={`${item.event}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 border border-cyber-border skew-x-[-4deg] -translate-x-2 translate-y-1 opacity-50 z-0 pointer-events-none group-hover:border-cyber-red/20 transition-all" />
            <div className="absolute inset-0 bg-cyber-card border border-cyber-border skew-x-[-4deg] group-hover:border-cyber-red/40 transition-all z-10 pointer-events-none shadow-2xl glass-morphism" />

            <Link to={`/gallery/${eventId}`} className="relative z-20 block aspect-video overflow-hidden rounded-lg m-1 border border-cyber-border hover:border-cyber-red/50 transition-all">
              <img 
                src={coverImage} 
                alt={item.event} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-cyber-red bg-cyber-red/10 px-2 py-0.5 border border-cyber-red/30 rounded uppercase tracking-widest">
                    {item.date}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {imageList.length} FILES
                  </span>
                </div>
                <h3 className="text-white font-orbitron font-bold text-xl group-hover:text-cyber-red transition-colors">
                  {item.event}
                </h3>
              </div>
              
              {/* Overlays and Icons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-cyber-red p-2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <ExternalLink size={16} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </PageWrapper>
);

const GalleryDetailPage = ({ photos }: { photos: any[] }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const event = photos.find(p => 
    encodeURIComponent(p.event.toLowerCase().replace(/\s+/g, '-')) === eventId
  );

  if (!event) return <div className="text-[var(--text-main)] p-24 text-center font-orbitron">RECORD_NOT_FOUND</div>;

  const imageList = parseContentImageList(event.images);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/gallery')}
            className="p-3 bg-cyber-card/50 hover:bg-cyber-red/10 border border-cyber-border hover:border-cyber-red/30 rounded-full text-[var(--text-muted)] hover:text-cyber-red transition-all group glass-morphism"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <SectionHeader 
            title={event.event} 
            subtitle={event.description} 
          />
        </div>
        <div className="bg-cyber-red/5 border border-cyber-red/20 px-6 py-3 rounded-xl glass-morphism">
          <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">Operational_Date</p>
          <p className="text-cyber-red font-orbitron font-bold text-lg">{event.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {imageList.map((imgUrl: string, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group min-h-[260px] sm:min-h-[340px] overflow-hidden rounded-2xl border border-cyber-border hover:border-cyber-red/30 transition-all shadow-xl glass-morphism bg-black/40"
          >
            <img 
              src={imgUrl} 
              alt={`${event.event} - ${idx}`}
              className="w-full h-full max-h-[78vh] object-contain opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/80 backdrop-blur-md p-2 rounded border border-white/10 text-[10px] font-mono text-white">
                IMG_{String(idx + 1).padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
};

const ConnectPage = ({ links }: { links: any[] }) => (
  <PageWrapper>
    <SectionHeader title="Establish Link" subtitle="Secure communication channels indexed. Prepare for transmission." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {links.map((social, idx) => (
        <motion.a 
          key={social.label}
          href={social.url || '#'}
          target={social.url ? '_blank' : undefined}
          rel={social.url ? 'noreferrer' : undefined}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="bg-cyber-card border border-cyber-border p-12 rounded-3xl text-center group flex flex-col items-center hover:bg-cyber-red/5 transition-all shadow-xl glass-morphism"
        >
          <div className="w-20 h-20 bg-cyber-red/5 text-cyber-red rounded-3xl flex items-center justify-center mb-8 group-hover:bg-cyber-red group-hover:text-white transition-all transform group-hover:rotate-6">
            <ConnectIcon icon={social.icon} />
          </div>
          <h4 className="text-[var(--text-main)] font-orbitron text-lg font-bold uppercase tracking-widest mb-4 group-hover:text-cyber-red transition-colors">{social.label}</h4>
          <div className="w-8 h-1 bg-cyber-red/20 mb-4 group-hover:w-16 transition-all" />
          <p className="text-[var(--text-muted)] text-[10px] uppercase font-mono font-bold tracking-[0.2em]">{social.description}</p>
        </motion.a>
      ))}
    </div>
  </PageWrapper>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const services = loadCollection(servicesGlob);
  const achievements = loadCollection(achievementsGlob);
  const photos = loadCollection(galleryGlob);
  const team = loadCollection(teamGlob);
  const projects = loadCollection(projectsGlob);
  const connectLinks = loadCollection(connectGlob);
  const heroData = matter(heroContent);
  const aboutData = matter(aboutContent);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-cyber-dark font-sans selection:bg-cyber-red selection:text-white relative crt">
        <div className="scanline" />
        <GlitchOverlay />
        <DigitalMapBackground />
        <CircuitLines />
        <Navbar />
        
        <main className="relative z-10 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage heroData={heroData} />} />
            <Route path="/about" element={<AboutPage aboutData={aboutData} />} />
            <Route path="/achievements" element={<AchievementsPage achievements={achievements} />} />
            <Route path="/gallery" element={<GalleryPage photos={photos} />} />
            <Route path="/gallery/:eventId" element={<GalleryDetailPage photos={photos} />} />
            <Route path="/services" element={<ServicesPage services={services} />} />
            <Route path="/projects" element={<ProjectsPage projects={projects} />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage projects={projects} />} />
            <Route path="/team" element={<TeamPage team={team} />} />
            <Route path="/connect" element={<ConnectPage links={connectLinks} />} />
          </Routes>
        </main>

        <footer className="bg-cyber-dark border-t border-cyber-border py-12 px-6 md:px-12 relative z-20">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={TEAM_LOGO_URL} alt="RAB" className="w-12 h-12 object-contain" />
              <div>
                <div className="font-orbitron font-bold text-xl text-[var(--text-main)]">RAB</div>
                <p className="text-[var(--text-muted)] text-[10px] font-mono tracking-widest uppercase whitespace-nowrap">REA11Y ANNOYING BOTS • ESTABLISHED 2025</p>
              </div>
            </div>
            
            <div className="flex gap-8 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
              <Link to="/team" className="hover:text-cyber-red transition-colors">THE_BOTS</Link>
              <Link to="/connect" className="hover:text-cyber-red transition-colors">ESTABLISH_LINK</Link>
              <a href="#" className="hover:text-cyber-red transition-colors">SITEMAP_CORE</a>
            </div>
            
            <p className="text-[10px] text-[var(--text-muted)] font-mono">© 2026 REA11Y ANNOYING BOTS. ALL SYSTEMS GO.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
