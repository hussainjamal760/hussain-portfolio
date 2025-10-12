import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { Sun, Moon, Briefcase, GraduationCap, Code, Globe, Github, Zap, Download, Mail, ArrowUp, X } from 'lucide-react'; // Added X icon

// --- 1. CONFIGURATION AND MOCK DATA ---
const COLORS = {
  navy: '#0B1220',
  cyan: '#00D1FF',
  accent: '#FFB86B',
  lightBg: '#F3F4F6',
  darkBg: '#0B1220',
  darkSurface: '#192330',
  lightSurface: '#FFFFFF',
  lightGray: '#E0E0E0', // Added for better text contrast
  darkGray: '#333333', // Added for better text contrast
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
  { role: 'Senior MERN Developer', company: 'Innovatech Solutions', years: '2022 - Present', description: 'Led development of two major SaaS products, focusing on performance optimization and scaling database architecture. Mentored junior developers and implemented CI/CD pipelines.' },
  { role: 'Full Stack Engineer', company: 'Digital Hive', years: '2019 - 2022', description: 'Built and maintained high-traffic customer-facing features using React and Node.js, improving load times by 30%. Collaborated with product teams to define technical specifications.' },
  { role: 'Web Development Intern', company: 'Future Labs', years: '2018 - 2019', description: 'Assisted in building responsive component libraries and integrating RESTful APIs. Gained foundational experience in MERN stack development.' },
];

const NAV_ITEMS = [
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

// --- 2. THEME CONTEXT AND HOOK ---
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


// --- 3. CUSTOM HOOKS ---

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
    isHovered, // Expose isHovered state
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

// --- 4. ANIMATION VARIANTS ---
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
 * Main application header with navigation and theme toggle.
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
 * Hero component with the animated background mesh.
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
 * Project Detail Modal Component
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
 * Single project card with complex micro-interactions.
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
 * Timeline component for Experience and Education.
 */
const Timeline = ({ items, icon: Icon, title }) => {
  return (
    <div className="space-y-12">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold border-b-2 pb-2 text-text border-cyan/30 flex items-center space-x-3">
        <Icon size={30} style={{ color: COLORS.cyan }} />
        <span>{title}</span>
      </motion.h2>

      <div className="relative border-l-4 border-accent/50 ml-4 pl-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="mb-8 relative"
          >
            {/* Timeline Dot */}
            <div className="absolute w-4 h-4 rounded-full bg-accent -left-10 transform -translate-y-1 border-4 border-surface dark:border-darkSurface" />

            <p className="text-xs font-mono text-cyan tracking-wider uppercase mb-1">{item.years}</p>
            <h3 className="text-xl font-semibold text-text">{item.role || item.institution}</h3>
            <p className="text-md text-gray-500 dark:text-gray-400">{item.company || item.degree}</p>
            <p className="mt-2 text-sm text-text/80">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
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

        {/* --- Tech Stack Section --- */}
        <SectionWrapper id="skills" className="bg-surface">
          <motion.h2 variants={itemVariants} className="text-center text-4xl font-bold mb-16 text-text">
            My Expertise
          </motion.h2>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {['JavaScript' , 'React.js (Frontend)', 'Node.js (Backend)','Express.js (Backend)', 'MongoDB (Database)','C++ (DSA)' ,'Bootstrap CSS (Styling)', 'Tailwind CSS (Styling)'].map((skill, index) => (
              <motion.div key={index} variants={itemVariants} className="p-6 rounded-xl bg-primary shadow-lg dark:shadow-xl dark:shadow-darkBg/50 border border-cyan/10">
                <Code size={32} className="mx-auto mb-3" style={{ color: COLORS.accent }} />
                <h3 className="text-xl font-semibold text-text">{skill.split('(')[0].trim()}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{skill.split('(')[1]}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* --- Projects Section --- */}
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

        {/* --- Experience & Education Section --- */}
        <SectionWrapper id="experience" className="bg-surface">
          <div className="grid md:grid-cols-2 gap-16">
            <Timeline items={EXPERIENCE} icon={Briefcase} title="Professional Experience" />
            <Timeline items={[{ degree: 'M.S. Computer Science', institution: 'State University', years: '2017 - 2019', description: 'Specialization in Distributed Systems and Cloud Computing.' }, { degree: 'B.S. Software Engineering', institution: 'Tech Institute', years: '2013 - 2017', description: 'Focused on algorithms, data structures, and web fundamentals.' }]} icon={GraduationCap} title="Education & Certifications" />
          </div>
        </SectionWrapper>

        {/* --- Contact & CTA Section --- */}
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
                href="mailto:hussain.jamal@example.com"
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

      <footer className="py-8 border-t border-surface mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Hussain Jamal All rights reserved.</p>
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
