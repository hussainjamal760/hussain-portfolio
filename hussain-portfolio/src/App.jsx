import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { Sun, Moon, Briefcase, GraduationCap, Code, Globe, Github, Zap, Download, Mail, ArrowUp, X, Trophy, BookOpen, Link, Monitor } from 'lucide-react'; // Added Trophy, BookOpen, Link, Monitor, and X icons

// --- 1. CONFIGURATION AND MOCK DATA ---
const COLORS = {
  navy: '#0B1220',
  cyan: '#00D1FF',
  accent: '#FFB86B',
  lightBg: '#F3F4F6',
  darkBg: '#0B1220',
  darkSurface: '#192330',
  lightSurface: '#FFFFFF',
  lightGray: '#E0E0E0',
  darkGray: '#333333',
};

const PROJECTS = [
  {
    id: 1,
    title: 'Nexus SaaS Platform',
    tagline: 'Full-stack collaborative workspace with real-time features.',
    tech: ['Next.js', 'Express', 'MongoDB', 'Tailwind', 'Stripe', 'Socket.io'],
    problem: 'Siloed team communication, inefficient project tracking, and complex billing hindering productivity.',
    solution: 'Developed an integrated platform offering real-time chat, collaborative task management, file sharing, and automated subscription handling via Stripe. Implemented WebSockets for instant updates.',
    impact: 'Reduced client churn by 15% through improved feature set, increased team velocity by 25% with streamlined workflows, and boosted user engagement by 30%.',
    liveLink: '#',
    githubLink: '#',
    lighthouse: 98,
    imageUrl: 'https://via.placeholder.com/400x250/0B1220/00D1FF?text=Nexus+Preview', // Placeholder
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&mute=1&controls=0&playlist=dQw4w9WgXcQ', // Rickroll for demo
    galleryImages: [
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Nexus+Screenshot+1',
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Nexus+Screenshot+2',
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Nexus+Screenshot+3',
    ],
  },
  {
    id: 2,
    title: 'E-commerce API Gateway',
    tagline: 'Scalable Microservices with Node.js and TypeScript.',
    tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    problem: 'Legacy monolith architecture struggling under peak load, leading to frequent downtimes and slow response times.',
    solution: 'Re-architected into a microservices-based API gateway handling authentication, product catalog, inventory, and order processing. Employed event-driven architecture with Kafka for inter-service communication.',
    impact: 'Achieved 99.99% uptime and 10x throughput capacity during Black Friday sales. Reduced API response times by 60%, significantly improving user experience.',
    liveLink: '#',
    githubLink: '#',
    lighthouse: 95,
    imageUrl: 'https://via.placeholder.com/400x250/0B1220/FFB86B?text=API+Gateway+Preview',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&loop=1&mute=1&controls=0&playlist=tgbNymZ7vqY', // Example video
    galleryImages: [
      'https://via.placeholder.com/800x500/0B1220/FFB86B?text=API+Screenshot+1',
      'https://via.placeholder.com/800x500/0B1220/FFB86B?text=API+Screenshot+2',
    ],
  },
  {
    id: 3,
    title: 'Real-time Dashboards',
    tagline: 'Data visualization platform with Socket.io and D3.js.',
    tech: ['React', 'D3.js', 'Socket.io', 'Mongoose', 'Chart.js'],
    problem: 'Need for immediate data synchronization and interactive visualization across multiple user dashboards.',
    solution: 'Developed a real-time analytics dashboard pushing live updates of key business metrics using WebSockets. Integrated D3.js and Chart.js for dynamic, interactive data visualization.',
    impact: 'Improved operational decision speed by 40% due to instant data access. Enhanced user engagement with intuitive and highly responsive data insights.',
    liveLink: '#',
    githubLink: '#',
    lighthouse: 96,
    imageUrl: 'https://via.placeholder.com/400x250/0B1220/00D1FF?text=Dashboard+Preview',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&loop=1&mute=1&controls=0&playlist=tgbNymZ7vqY', // Example video
    galleryImages: [
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Dashboard+Screenshot+1',
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Dashboard+Screenshot+2',
      'https://via.placeholder.com/800x500/0B1220/00D1FF?text=Dashboard+Screenshot+3',
    ],
  },
];

const EXPERIENCE = [
  { role: 'Bronze level Fellow', company: 'Dev Weekends', years: '2025 - Present', description: 'Three months of the Dev Weekend Fellowship were a transformative journey  I pushed my limits, mastered the MERN Stack, and strengthened my problem-solving with DSA. It taught me consistency, teamwork, and the real meaning of growth through continuous learning.' },
  { role: 'Freelancer', company: 'Fiverr', years: '2022 - 2023', description: 'Gained hands-on experience as a Frontend Developer using JavaScript, building responsive and user-friendly web interfaces for clients on Fiverr while improving skills in real-world project delivery and client communication.' },

];

const EDUCATION = [
  { role: 'BS. Computer Science', company: 'COMSATS , Lahore', years: '2025 - 2029', description: 'Focused on algorithms, data structures, and MERN fundamentals.' },
  { role: 'Inter in Computer Science', company: 'Punjab College ,Pattoki', years: '2022 - 2024', description: 'Focused on C , frontend Fundamentals' },
];

const ACHIEVEMENTS = [
  { role: 'Dev Weekends Fellowship Certified', company: 'Dev Weekends', years: '2025', description: 'Three months of the Dev Weekend Fellowship were a transformative journey  I pushed my limits, mastered the MERN Stack, and strengthened my problem-solving with DSA. It taught me consistency, teamwork, and the real meaning of growth through continuous learning.' },
  { role: 'LeetCode 100', company: 'LeetCode', years: '2025', description: 'Completed 100 Leetcode problems, showcasing proficiency in advanced data structures and algorithms.' },
];

const NAV_ITEMS = [
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Contributions', href: '#contributions' },
  { name: 'Contact', href: '#contact' },
];

const SKILLS = [
  { name: 'React.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'C++', category: 'DSA' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Bootstrap CSS', category: 'Styling' },
];

// --- 2. THEME CONTEXT AND HOOK (No change) ---
const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-primary', COLORS.navy);
      root.style.setProperty('--color-surface', COLORS.darkSurface);
      root.style.setProperty('--color-text', COLORS.lightGray);
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-primary', COLORS.lightBg);
      root.style.setProperty('--color-surface', COLORS.lightSurface);
      root.style.setProperty('--color-text', COLORS.darkGray);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return [theme, toggleTheme];
};


// --- 3. CUSTOM HOOKS (No change) ---

/**
 * Hook for cursor-aware parallax and hover tilt on elements.
 * @param {number} tiltFactor - Max rotation angle.
 * @param {number} parallaxFactor - Max translation distance for inner elements.
 * @returns {{ref: React.RefObject, style: object}}
 */
const useParallaxTilt = (tiltFactor = 8, parallaxFactor = 10) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform for the full card tilt
  const rotateX = useTransform(y, [0, 1], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(x, [0, 1], [-tiltFactor, tiltFactor]);

  // Transform for the inner parallax movement
  const innerParallaxX = useTransform(x, [0, 1], [-parallaxFactor, parallaxFactor]);
  const innerParallaxY = useTransform(y, [0, 1], [-parallaxFactor, parallaxFactor]);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalize coordinates to be between 0 and 1
    const xPct = clientX / width;
    const yPct = clientY / height;

    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0.5); // Center reset
    y.set(0.5);
    setIsHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  return {
    ref,
    isHovered,
    cardStyle: {
      rotateX: isHovered ? rotateX : 0,
      rotateY: isHovered ? rotateY : 0,
      transformPerspective: 1000,
      transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
    },
    innerStyle: {
      x: isHovered ? innerParallaxX : 0,
      y: isHovered ? innerParallaxY : 0,
      transition: 'transform 0.2s ease-out',
    },
  };
};

// --- 4. ANIMATION VARIANTS (No change) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const heroVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.6, 0.05, 0.01, 0.9] } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } },
};

// --- 5. REUSABLE COMPONENTS ---

/**
 * Wraps a section to apply reveal-on-scroll animation.
 */
const SectionWrapper = ({ id, children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? { initial: false, animate: isInView ? 'visible' : 'hidden' }
    : { initial: 'hidden', animate: isInView ? 'visible' : 'hidden' };

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`py-16 md:py-24 ${className}`}
      variants={containerVariants}
      {...motionProps}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  );
};

/**
 * Main application header with navigation and theme toggle. (NAV_ITEMS updated)
 */
const Header = ({ theme, toggleTheme }) => {
  const HJLogo = (
    <span className="font-mono text-xl font-bold tracking-widest ">
      <img className='h-26 object-contain rounded' src="logo.png" alt="logo HJ" />
    </span>
  );

  return (
    <header className="sticky top-0 z-50 bg-lightSurface/90 dark:bg-darkBg/90 backdrop-blur-sm transition-colors duration-300 shadow-md dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <a href="#hero" className="flex items-center space-x-2" aria-label="Hussain Jamal Home">
          {HJLogo}
        </a>

        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-text hover:text-cyan dark:hover:text-cyan transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text hover:bg-gray-200 dark:hover:bg-darkSurface transition-colors"
            aria-label="Toggle dark/light theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Moon size={20} style={{ color: COLORS.accent }} /> : <Sun size={20} style={{ color: COLORS.cyan }} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * Hero component with the animated background mesh. (No change)
 */
const Hero = () => {
  return (
    <SectionWrapper id="hero" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Geometric Mesh Background (CSS + Framer Motion) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 5, ease: 'easeInOut' }}
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${COLORS.cyan} 0, ${COLORS.cyan} 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, ${COLORS.cyan} 0, ${COLORS.cyan} 1px, transparent 1px, transparent 20px)`,
          backgroundSize: '40px 40px',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '100%'], y: ['0%', '100%'] }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: 'linear' },
            y: { duration: 25, repeat: Infinity, ease: 'linear' },
          }}
          className="absolute inset-0 bg-darkBg opacity-50"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 90%, ${COLORS.accent} 1%, transparent 10%), radial-gradient(circle at 90% 10%, ${COLORS.cyan} 1%, transparent 10%)`,
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center space-y-6 p-6 rounded-xl"
      >
        <motion.img
          src="me.png" // Placeholder for profile pic
          alt="Hussain Jamal"
          className="rounded-full w-36 h-36 object-cover mx-auto mb-4 border-4 border-cyan shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text">
          Hussain Jamal
        </motion.h1>

        <motion.p className="text-xl md:text-2xl max-w-3xl mx-auto text-cyan-600 font-light">
          MERN Stack Developer building scalable web apps with product-first design.
        </motion.p>

        <div className="flex justify-center space-x-6 pt-4">
          <motion.a
            href="#projects"
            className="group px-8 py-3 text-lg font-semibold rounded-lg bg-cyan text-darkBg shadow-lg hover:shadow-cyan/50 transition-all duration-300 transform hover:scale-[1.03]"
            whileHover={{ y: -3 }}
          >
            View Work
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-3 text-lg font-semibold rounded-lg border-2 border-accent text-accent hover:bg-accent/10 transition-colors duration-300 transform hover:scale-[1.03]"
            whileHover={{ y: -3 }}
          >
            Hire Me
          </motion.a>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

/**
 * Project Detail Modal Component (No change)
 */
const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-darkBg/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-5xl bg-surface rounded-xl shadow-2xl p-6 md:p-10 text-text max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-primary/50 text-lightGray hover:bg-primary transition-colors"
            aria-label="Close project details"
          >
            <X size={24} />
          </button>

          <h2 className="text-4xl font-bold text-cyan mb-3">{project.title}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{project.tagline}</p>

          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={project.videoUrl.replace('autoplay=1&loop=1&mute=1&controls=0', 'autoplay=0&controls=1')} // Modal video should not autoplay and have controls
              title={`${project.title} Demo`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-accent mb-3">Problem</h3>
              <p className="text-text/80">{project.problem}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-accent mb-3">Solution</h3>
              <p className="text-text/80">{project.solution}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-accent mb-3">Impact</h3>
            <p className="text-text/80">{project.impact}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-accent mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-4 py-2 text-sm font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-accent mb-3">Screenshots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${project.title} Screenshot ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover shadow-md"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-6 pt-4">
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-6 py-3 text-lg font-medium rounded-lg bg-cyan text-darkBg hover:bg-cyan/90 transition-colors">
              <Globe size={20} />
              <span>Live Demo</span>
            </a>
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-6 py-3 text-lg font-medium rounded-lg border-2 border-accent text-accent hover:bg-accent/10 transition-colors">
              <Github size={20} />
              <span>GitHub Repo</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


/**
 * Single project card with complex micro-interactions. (No change)
 */
const ProjectCard = ({ project, onCardClick }) => {
  const { ref, isHovered, cardStyle, innerStyle } = useParallaxTilt();

  const LighthouseBadge = ({ score }) => (
    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold text-darkBg ${score >= 95 ? 'bg-green-400' : 'bg-yellow-400'}`}>
      <Zap size={12} />
      <span>{score}</span>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      style={cardStyle}
      variants={itemVariants}
      className="relative p-6 rounded-2xl shadow-xl bg-surface dark:shadow-2xl dark:shadow-darkBg/50 transition-all duration-300 border border-transparent hover:border-cyan/50 cursor-pointer overflow-hidden group"
      onClick={() => onCardClick(project)} // Open modal on card click
    >
      {/* Layered Glow on Hover */}
      <div className="absolute inset-0 bg-transparent rounded-2xl transition-all duration-500 ease-out opacity-0 group-hover:opacity-100"
           style={{ background: `radial-gradient(circle at center, ${COLORS.cyan} 1%, transparent 70%)` }}
      />

      <motion.div style={innerStyle} className="relative z-10 space-y-4">
        {/* Image/Video Container */}
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-md">
          <AnimatePresence mode="wait">
            {isHovered && project.videoUrl ? (
              <motion.iframe
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={project.videoUrl}
                title={`${project.title} Demo`}
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full object-cover"
              ></motion.iframe>
            ) : (
              <motion.img
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={project.imageUrl}
                alt={`${project.title} Preview`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>


        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-text transition-colors">{project.title}</h3>
          <LighthouseBadge score={project.lighthouse} />
        </div>

        <p className="text-gray-500 dark:text-gray-400 font-light text-sm">{project.tagline}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tech.map((t) => (
            <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-cyan/10 text-cyan dark:text-cyan border border-cyan/30">
              {t}
            </span>
          ))}
        </div>

        {/* Removed direct links from card to encourage modal click */}
      </motion.div>
    </motion.div>
  );
};

/**
 * NEW: Animated Skill Card Component
 */
const AnimatedSkillCard = ({ skill, category }) => (
  <motion.div
    variants={itemVariants}
    className="p-6 rounded-xl bg-primary shadow-lg dark:shadow-xl dark:shadow-darkBg/50 border border-cyan/10"
    whileHover={{
      scale: 1.05,
      boxShadow: `0 0 20px 0 ${COLORS.cyan}80`, // Subtle cyan glow
      transition: { duration: 0.2 },
    }}
  >
    <Code size={32} className="mx-auto mb-3" style={{ color: COLORS.accent }} />
    <h3 className="text-xl font-semibold text-text">{skill}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>
  </motion.div>
);


/**
 * NEW: Tabbed Section for Experience, Education, and Achievements
 */
const TabbedSection = () => {
  const [activeTab, setActiveTab] = useState('experience');

  const tabs = [
    { key: 'experience', name: 'Experience', icon: Briefcase, content: EXPERIENCE },
    { key: 'education', name: 'Education', icon: GraduationCap, content: EDUCATION },
    { key: 'achievements', name: 'Achievements', icon: Trophy, content: ACHIEVEMENTS },
  ];

  const ActiveIcon = tabs.find(t => t.key === activeTab)?.icon || Briefcase;
  const activeContent = tabs.find(t => t.key === activeTab)?.content || [];

  return (
    <div id="timeline">
      <motion.h2 variants={itemVariants} className="text-center text-4xl font-bold mb-10 text-text">
        Timeline
      </motion.h2>

      <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-10">
        <div className="flex justify-center border-b-2 border-cyan/30">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
                activeTab === tab.key
                  ? 'text-cyan border-b-4 border-cyan'
                  : 'text-text/70 hover:text-cyan/80 border-b-4 border-transparent'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="relative max-w-4xl mx-auto pt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative border-l-4 border-accent/50 ml-4 pl-8"
        >
          {activeContent.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-8 relative"
            >
              {/* Timeline Dot */}
              <div className="absolute w-4 h-4 rounded-full bg-accent -left-10 transform -translate-y-1 border-4 border-surface dark:border-darkSurface" />

              <p className="text-xs font-mono text-cyan tracking-wider uppercase mb-1">{item.years}</p>
              <h3 className="text-xl font-semibold text-text">{item.role}</h3>
              <p className="text-md text-gray-500 dark:text-gray-400">{item.company}</p>
              <p className="mt-2 text-sm text-text/80">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


/**
 * OLD: Timeline component (Removed, replaced by TabbedSection)
 */

/**
 * NEW: Contributions Section
 */
const ContributionsSection = () => {
  const ContributionBlock = ({ title, description, link, icon: Icon, color }) => (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      className="block p-8 rounded-xl bg-surface shadow-xl dark:shadow-2xl dark:shadow-darkBg/50 transition-all duration-300 transform hover:scale-[1.03] hover:border-b-4"
      style={{ borderBottomColor: color }}
      whileHover={{ y: -3 }}
    >
      <Icon size={36} className="mb-4" style={{ color }} />
      <h3 className="text-2xl font-bold text-text mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      <span className="flex items-center space-x-1 text-sm font-semibold" style={{ color }}>
        <Link size={16} />
        <span>View Profile</span>
      </span>
    </motion.a>
  );

  return (
    <SectionWrapper id="contributions" className="bg-primary">
      <motion.h2 variants={itemVariants} className="text-center text-4xl font-bold mb-16 text-text">
        Code Contributions & Stats
      </motion.h2>

      <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-10">
        <ContributionBlock
          title="GitHub Activity"
          description="See my daily code contributions, repositories, and open source involvement on GitHub. (Placeholder for Contribution Graph)"
          link="https://github.com/hussainjamal760"
          icon={Github}
          color={COLORS.cyan}
        />
        <ContributionBlock
          title="LeetCode Performance"
          description="View my competitive programming profile and solve streak on LeetCode. (Placeholder for Contest Rating/Solved Count)"
          link="https://leetcode.com/u/hussain_Jamal/"
          icon={Code}
          color={COLORS.accent}
        />
      </motion.div>
    </SectionWrapper>
  );
};


// --- 6. MAIN APP COMPONENT ---

const App = () => {
  const [theme, toggleTheme] = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  const openProjectModal = useCallback((project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Disable scroll when modal is open
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = ''; // Re-enable scroll
  }, []);

  return (
    <div className="min-h-screen font-sans bg-primary text-text transition-colors duration-300" style={{ color: `var(--color-text)` }}>
      <style>{`
        /* Global CSS for variables, font, and smooth scrolling */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        html {
          scroll-behavior: smooth;
          font-family: 'Inter', sans-serif;
        }
        .dark {
          --color-primary: ${COLORS.navy};
          --color-surface: ${COLORS.darkSurface};
          --color-text: ${COLORS.lightGray};
        }
        .light {
          --color-primary: ${COLORS.lightBg};
          --color-surface: ${COLORS.lightSurface};
          --color-text: ${COLORS.darkGray};
        }
        body {
          background-color: var(--color-primary);
          color: var(--color-text);
        }
        .bg-surface { background-color: var(--color-surface); }
      `}</style>
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />

        {/* --- Tech Stack Section (Updated with AnimatedSkillCard) --- */}
        <SectionWrapper id="skills" className="bg-surface">
          <motion.h2 variants={itemVariants} className="text-center text-4xl font-bold mb-16 text-text">
            My Expertise
          </motion.h2>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {SKILLS.map((skill, index) => (
              <AnimatedSkillCard key={index} skill={skill.name} category={skill.category} />
            ))}
          </motion.div>
        </SectionWrapper>

        {/* --- Projects Section (No change) --- */}
        <SectionWrapper id="projects">
          <motion.h2 variants={itemVariants} className="text-center text-4xl font-bold mb-16 text-text">
            Selected Projects
          </motion.h2>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onCardClick={openProjectModal} />
            ))}
          </motion.div>
        </SectionWrapper>

        {/* --- Experience & Education Section (Replaced by TabbedSection) --- */}
        <SectionWrapper id="timeline" className="bg-surface">
          <TabbedSection />
        </SectionWrapper>
        
        {/* --- Contributions Section (New) --- */}
        <ContributionsSection />

        {/* --- Contact & CTA Section (No change) --- */}
        <SectionWrapper id="contact">
          <motion.div variants={containerVariants} className="max-w-4xl mx-auto text-center p-10 rounded-2xl bg-surface shadow-2xl dark:shadow-cyan/10">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-text mb-4">
              Ready to Build the Next Scalable App?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-500 dark:text-gray-400 mb-8">
              Let's connect and discuss how my expertise can drive your product forward.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.a
                href="mailto:hjamal9865@gmail.com"
                className="group flex items-center justify-center space-x-2 px-8 py-3 text-lg font-semibold rounded-lg bg-cyan text-darkBg shadow-lg hover:shadow-cyan/50 transition-all duration-300 transform hover:scale-[1.03]"
                whileHover={{ y: -3 }}
              >
                <Mail size={20} className="transition-transform group-hover:rotate-6" />
                <span>Get In Touch</span>
              </motion.a>
              <motion.a
                href="me.png" 
                download
                className="group flex items-center justify-center space-x-2 px-8 py-3 text-lg font-semibold rounded-lg border-2 border-accent text-accent hover:bg-accent/10 transition-colors duration-300 transform hover:scale-[1.03]"
                whileHover={{ y: -3 }}
              >
                <Download size={20} className="transition-transform group-hover:scale-110" />
                <span>Download CV</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </SectionWrapper>
      </main>

      {/* --- Footer (Enhanced) --- */}
      <footer className="py-10 border-t border-surface/50 mt-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center space-x-6 mb-4">
                <a href="#hero" className="text-lg font-bold text-cyan hover:text-accent transition-colors">Hussain Jamal</a>
            </div>
            <div className="flex justify-center space-x-6 mb-6">
                <a href="https://github.com/hussainjamal760" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-text hover:text-cyan transition-colors">
                    <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/hussain-jamal-b5a76531a/e" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-text hover:text-cyan transition-colors">
                    {/* Placeholder for LinkedIn Icon - not in lucide-react by default, so using Globe for now */}
                    <Globe size={24} /> 
                </a>
                <a href="mailto:hjamal9865@gmail.com" aria-label="Email Me" className="text-text hover:text-cyan transition-colors">
                    <Mail size={24} />
                </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Crafted with React, Tailwind CSS, and Framer Motion.
            </p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-500">
                &copy; {new Date().getFullYear()} Hussain Jamal. All rights reserved.
            </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <a href="#hero" className="fixed bottom-6 right-6 p-3 rounded-full bg-cyan text-darkBg shadow-lg hover:shadow-cyan/70 transition-opacity duration-300" aria-label="Scroll to top">
        <ArrowUp size={24} />
      </a>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal project={selectedProject} onClose={closeProjectModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;