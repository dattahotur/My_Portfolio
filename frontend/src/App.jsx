import React, { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Send } from "lucide-react";

// Custom SVG Brand Icons since Lucide v1.x does not include brand logos
const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function App() {
  // ── States ──
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "Welcome to Gargeya Datta Hotur's Portfolio CLI [Version 1.0.0]", type: "system" },
    { text: "Type 'help' to see list of available commands.", type: "system" },
    { text: "&nbsp;", type: "system" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Refs ──
  const terminalInputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  // ── Project Details Data ──
  const projectDetails = {
    sharemyfood: {
      title: "ShareMyFood",
      image: "/images/projects_images/sharemyfood.jpeg",
      description: "Developed a microservices-based MERN application connecting customers, restaurants, NGOs, and delivery partners. Implemented order management, food donation workflows, secure authentication, real-time notifications, and MongoDB integration. It connects directly to the companion RidePartner portal: when an order is created, ShareMyFood dispatches it to RidePartner, tracking the driver's real-time progress and status changes (Accepted, Picked Up, Delivered) to update customers instantly.",
      challenges: [
        "Designed and implemented 5 distinct microservices (User, Recipe, Order, Notification, Delivery) operating behind a centralized API Gateway.",
        "Built a robust delivery partner workflow with real-time status updates, rating prompts, and warning banners for platform policy enforcement.",
        "Resolved critical race conditions in claiming food donations by implementing atomic database increments and decrements in the recipe service.",
        "Enforced platform rules restricting role access (e.g., preventing restaurants from claiming donations and requiring NGO verification)."
      ],
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Docker", "REST API", "Microservices", "Nodemailer"],
      demoUrl: "#",
      githubUrl: "https://github.com/dattahotur/ShareMyFood-app.git"
    },
    deliveryapp: {
      title: "RidePartner (Delivery App)",
      image: "/images/projects_images/deliveryapp.png",
      description: "Designed and built an interactive driver portal within a microservices architecture. Operating as a companion driver app for ShareMyFood, it polls the central API gateway to fetch pending dispatches, manages the delivery lifecycle (Pending -> Accepted -> Picked Up -> Delivered), and synchronizes order states back to ShareMyFood while processing wallet earnings and payouts.",
      challenges: [
        "Constructed a status-machine for order tracking (Pending -> Accepted -> Picked Up -> Delivered) preventing race conditions during claims.",
        "Implemented a robust direct withdrawal portal supporting instant payouts via Bank Account/UPI with strict format validation.",
        "Built real-time dispatch alerts polling system to notify online riders when orders become available.",
        "Designed policy enforcement features issuing warning banners and Infraction Panels to active drivers."
      ],
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Axios", "REST API", "Microservices", "Lucide Icons"],
      demoUrl: "#",
      githubUrl: "https://github.com/dattahotur/ShareMyFood-app.git"
    },
    portfolio: {
      title: "My Portfolio",
      image: "/images/projects_images/portfolio.png",
      description: "Designed and developed a modern responsive portfolio website to showcase projects, skills, and developer profile with smooth UI and animations.",
      challenges: [
        "Implemented responsive designs down to 320px screen width using media queries and CSS grid layouts.",
        "Built a Geek-Mode CLI Terminal emulator letting technical recruiters run shell-like commands to query skills and project details.",
        "Integrated an interactive skills-filtering system that highlights relevant projects using hardware-accelerated CSS transitions.",
        "Created a custom Node.js contact form backend with nodemailer for secure, direct email delivery."
      ],
      tech: ["HTML5", "CSS3", "JavaScript (ES6+)", "Node.js", "Express.js", "Nodemailer", "Responsive UI", "CSS Animations"],
      demoUrl: "#",
      githubUrl: "#"
    }
  };

  // ── Skill Categories List ──
  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        { name: "HTML5", filter: "frontend" },
        { name: "CSS3", filter: "frontend" },
        { name: "JavaScript", filter: "frontend" },
        { name: "Responsive UI", filter: "frontend" }
      ]
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js", filter: "nodejs" },
        { name: "Express.js", filter: "expressjs" },
        { name: "Java", filter: "java" }
      ]
    },
    {
      category: "Databases",
      skills: [
        { name: "MongoDB", filter: "mongodb" },
        { name: "Mongoose", filter: "mongodb" },
        { name: "SQL", filter: "tools" }
      ]
    },
    {
      category: "Frameworks",
      skills: [
        { name: "React.js", filter: "react" }
      ]
    },
    {
      category: "Tools",
      skills: [
        { name: "Git & GitHub", filter: "tools" },
        { name: "Docker", filter: "tools" },
        { name: "Postman", filter: "tools" },
        { name: "Node NPM", filter: "tools" }
      ]
    },
    {
      category: "APIs",
      skills: [
        { name: "REST APIs", filter: "expressjs" },
        { name: "API Gateways", filter: "nodejs" }
      ]
    }
  ];

  // ── Projects List ──
  const projects = [
    {
      id: "sharemyfood",
      title: "ShareMyFood",
      image: "/images/projects_images/sharemyfood.jpeg",
      desc: "Developed a MERN microservices app connecting customers, restaurants, NGOs, and delivery partners. It integrates directly with the RidePartner companion app to dispatch delivery jobs, track driver status, and synchronize order fulfillment states in real-time.",
      techs: ["React", "Node.js", "MongoDB", "Express.js"],
      dataTech: "react nodejs expressjs mongodb frontend tools",
      github: "https://github.com/dattahotur/ShareMyFood-app.git",
      demo: "#"
    },
    {
      id: "deliveryapp",
      title: "RidePartner (Delivery App)",
      image: "/images/projects_images/deliveryapp.png",
      desc: "Designed and built an interactive driver portal companion for ShareMyFood, integrating real-time order matching, status tracking updates, and direct wallet payouts. It polls the ShareMyFood services to claim dispatches and updates the central database upon delivery.",
      techs: ["React", "Express.js", "MongoDB", "Microservices"],
      dataTech: "react nodejs expressjs mongodb frontend tools",
      github: "https://github.com/dattahotur/ShareMyFood-app.git",
      demo: "#"
    },
    {
      id: "portfolio",
      title: "My Portfolio",
      image: "/images/projects_images/portfolio.png",
      desc: "Designed and developed a modern responsive portfolio website to showcase projects, skills, and developer profile with smooth UI and animations.",
      techs: ["HTML", "CSS", "Responsive UI"],
      dataTech: "frontend html css",
      github: "#",
      demo: "#"
    }
  ];

  // ── CLI Terminal Commands ──
  const executeCommand = (cmd) => {
    const inputVal = cmd.trim().toLowerCase();
    if (!inputVal) return;

    // Echo command
    setTerminalHistory(prev => [...prev, { text: `gdatta@portfolio:~$ ${cmd}`, type: "command" }]);

    const cmdHandlers = {
      help: () => {
        setTerminalHistory(prev => [
          ...prev,
          { text: "Available commands:", type: "system" },
          { text: "<div class='term-help-grid'><span class='term-help-cmd'>help</span><span class='term-help-desc'>Display this list of commands</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>whoami</span><span class='term-help-desc'>Brief developer bio and education info</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>skills</span><span class='term-help-desc'>Show full list of skills & proficiencies</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>projects</span><span class='term-help-desc'>Detailed information about built projects</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>contact</span><span class='term-help-desc'>Show email, github, and social contact links</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>clear</span><span class='term-help-desc'>Clear the terminal screen</span></div>" +
                  "<div class='term-help-grid'><span class='term-help-cmd'>exit</span><span class='term-help-desc'>Close the terminal console</span></div>", type: "raw" }
        ]);
      },
      whoami: () => {
        setTerminalHistory(prev => [
          ...prev,
          { text: "<span class='highlight'>Gargeya Datta Hotur</span> - Aspiring Full Stack Developer", type: "success" },
          { text: "B.Tech Final Year Student & MERN Stack developer passionate about clean UI and efficient backend architectures.", type: "system" },
          { text: "Location: Andhra Pradesh, India", type: "system" }
        ]);
      },
      skills: () => {
        setTerminalHistory(prev => [
          ...prev,
          { text: "Technical Skills:", type: "highlight" },
          { text: "  Frontend  : HTML, CSS, JavaScript (ES6+), React.js", type: "system" },
          { text: "  Backend   : Node.js, Express.js, REST APIs", type: "system" },
          { text: "  Databases : MongoDB, Mongoose, SQL", type: "system" },
          { text: "  Languages : Java, JavaScript", type: "system" },
          { text: "  Tools     : Git & GitHub, Postman, Docker, Node NPM", type: "system" }
        ]);
      },
      projects: () => {
        setTerminalHistory(prev => [
          ...prev,
          { text: "My Key Projects:", type: "highlight" },
          { text: "1. <span class='highlight'>ShareMyFood</span>: Microservices-based MERN application connecting customers, restaurants, NGOs, and delivery partners. Dispatches delivery jobs directly to the RidePartner companion app and tracks driver status updates in real-time.", type: "success" },
          { text: "   Tech: React.js, Node.js, Express.js, MongoDB, Docker, API Gateway", type: "system" },
          { text: "2. <span class='highlight'>RidePartner (Delivery App)</span>: Companion driver portal within the ShareMyFood microservices architecture, polling central services for pending dispatches, managing delivery states, and processing wallet payouts upon completion.", type: "success" },
          { text: "   Tech: React.js, Node.js, Express.js, MongoDB, REST API, Geolocation Simulation", type: "system" },
          { text: "3. <span class='highlight'>My Portfolio</span>: Custom responsive developer portfolio displaying developer bio, timeline, and interactive modules.", type: "success" },
          { text: "   Tech: HTML5, CSS3, ES6 JavaScript, Nodemailer Email Server", type: "system" }
        ]);
      },
      contact: () => {
        setTerminalHistory(prev => [
          ...prev,
          { text: "Connect with me:", type: "highlight" },
          { text: "  Email    : <a href='mailto:dattahotur369@gmail.com' style='color:#f59e0b;'>dattahotur369@gmail.com</a>", type: "system" },
          { text: "  GitHub   : <a href='https://github.com/dattahotur' target='_blank' style='color:#f59e0b;'>github.com/dattahotur</a>", type: "system" },
          { text: "  LinkedIn : <a href='#' style='color:#f59e0b;'>linkedin.com/in/yourprofile</a>", type: "system" }
        ]);
      },
      clear: () => {
        setTerminalHistory([]);
      },
      exit: () => {
        setIsTerminalOpen(false);
      }
    };

    if (cmdHandlers[inputVal]) {
      cmdHandlers[inputVal]();
    } else {
      setTerminalHistory(prev => [
        ...prev,
        { text: `Command not found: '${inputVal}'. Type 'help' for options.`, type: "error" }
      ]);
    }
  };

  // ── Scroll observer for Timeline ──
  useEffect(() => {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });

    return () => {
      timelineItems.forEach(item => {
        timelineObserver.unobserve(item);
      });
    };
  }, []);

  // ── Terminal Autoscroll ──
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // ── Focus terminal input on open ──
  useEffect(() => {
    if (isTerminalOpen && terminalInputRef.current) {
      setTimeout(() => {
        terminalInputRef.current.focus();
      }, 100);
    }
  }, [isTerminalOpen]);

  // ── Lock background scroll when modal or terminal is active ──
  useEffect(() => {
    if (activeProject || isTerminalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject, isTerminalOpen]);

  // ── Handle Skills Filter Click ──
  const handleSkillClick = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  // ── Contact Form Submission ──
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus({ type: "success", message: result.message || "Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus({ type: "error", message: result.message || "Failed to send message." });
      }
    } catch (error) {
      console.error(error);
      setFormStatus({ type: "error", message: "Failed to connect to the server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header>
        <div className="profile">
          <img className="profile-img" src="/images/my_name.png" alt="My Name" />
        </div>
        <nav className="nav-links">
          <a href="#about">about</a>
          <a href="#skills">skills</a>
          <a href="#timeline">journey</a>
          <a href="#projects">projects</a>
          <a href="#contact">contact</a>
        </nav>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="hero-container">
        <div className="hero-content">
          <h1>Architecting Scalable Full-Stack Solutions</h1>
          <h2 className="hero-subtitle">
            Full Stack Developer | B.Tech Final Year Student
          </h2>
          <p>
            B.Tech Final Year student and aspiring Full Stack Developer passionate
            about designing and developing modern web applications with clean user
            interfaces and efficient backend systems. Skilled in React, Node.js,
            MongoDB, and Java, with a strong focus on creating scalable,
            responsive, and user-centric digital experiences through continuous
            learning, real-world project development, and solving practical
            problems through innovative technology solutions.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="resume.pdf" download className="btn-secondary">
              Download Resume
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <img id="photo" src="/images/datta.png" alt="my photo" />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about">
        <h1>About Me</h1>
        <p>
          Turning ideas into powerful web applications is what motivates me every
          day. I enjoy building responsive interfaces and efficient backend
          architectures. Focused on creating scalable, clean, and user-centric
          digital experiences. Passionate about innovation, problem-solving, and
          modern web technologies. Always learning, experimenting, and growing
          as a Full Stack Developer.
        </p>
        <div className="about-cards">
          <div className="card">
            <img id="about_img" src="/images/fulls_stack.jpg" alt="Full Stack Developer" />
            Full Stack Developer
          </div>
          <div className="card">
            <img id="about_img" src="/images/project_builder.png" alt="Project Builder" />
            Project Builder
          </div>
          <div className="card">
            <img id="about_img" src="/images/continuous_learning.webp" alt="Continuous Learner" />
            Continuous Learner
          </div>
          <div className="card">
            <img id="about_img" src="/images/problem solving.jpg" alt="Problem Solver" />
            Problem Solver
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section id="stats">
        <div className="stat-card">
          <h2>3+</h2>
          <p>Major Projects</p>
        </div>
        <div className="stat-card">
          <h2>6+</h2>
          <p>Microservices Built</p>
        </div>
        <div className="stat-card">
          <h2>10+</h2>
          <p>Technologies Used</p>
        </div>
        <div className="stat-card">
          <h2>100%</h2>
          <p>Learning Mindset</p>
        </div>
      </section>

      {/* ================= SKILLS SECTION ================= */}
      <section id="skills">
        <h1>My Skills</h1>
        <div className="skills-categories-container">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="skills-category-row">
              <div className="skills-category-heading">
                {cat.category}
              </div>
              <div className="skills-items-grid">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className={`skill-pill ${activeFilter === skill.filter ? "active-filter" : ""}`}
                    onClick={() => handleSkillClick(skill.filter)}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= JOURNEY TIMELINE ================= */}
      <section id="timeline">
        <h1>My Journey</h1>
        <div className="timeline-container">
          <div className="timeline-line"></div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="timeline-date">2022 - Present</span>
              <h3>B.Tech in Computer Science</h3>
              <p>
                Developing deep foundations in data structures, algorithms, and
                software engineering principles at university while maintaining a
                strong academic focus.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="timeline-date">2024</span>
              <h3>Exploring Web Development</h3>
              <p>
                Mastered modern JavaScript, HTML5, CSS3, responsive layout design,
                and started building dynamic frontends using React.js.
              </p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="timeline-date">2025</span>
              <h3>Microservices & Full-Stack Mastery</h3>
              <p>
                Architected and built ShareMyFood—a microservices-based web
                application utilizing Express, MongoDB, Node.js, API Gateways,
                and atomic state synchronization.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="timeline-date">2026</span>
              <h3>Advanced Agentic Systems & Payout Platforms</h3>
              <p>
                Optimized microservices, fixed race conditions in claims
                handling, and integrated secure validation constraints for
                delivery payouts on RidePartner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section id="projects">
        <h1>My Projects</h1>
        <div className="projects-grid">
          {projects.map((project, index) => {
            const isMatch = activeFilter
              ? project.dataTech.split(" ").includes(activeFilter)
              : null;
            const projectClass =
              activeFilter === null
                ? ""
                : isMatch
                ? "highlighted"
                : "dimmed";

            return (
              <div
                key={index}
                className={`project-card ${projectClass}`}
                data-project-id={project.id}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveProject(project.id)}
                />
                <div className="project-content">
                  <h2
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveProject(project.id)}
                  >
                    {project.title}
                  </h2>
                  <p>{project.desc}</p>
                  <div className="tech-stack">
                    {project.techs.map((tech, idx) => (
                      <span key={idx}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-buttons">
                    {project.demo !== "#" && (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="project-btn">
                        Live Demo
                      </a>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn secondary-project-btn"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FLOATING ACTION BUTTONS ================= */}
      <button
        id="terminalLauncher"
        className="terminal-fab"
        title="Open Geek-Mode Terminal"
        onClick={() => setIsTerminalOpen(true)}
      >
        <span>&gt;_</span>
      </button>

      {/* ================= CLI TERMINAL OVERLAY ================= */}
      <div className={`terminal-overlay ${isTerminalOpen ? "active" : ""}`}>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="term-btn close" onClick={() => setIsTerminalOpen(false)}></span>
              <span className="term-btn minimize"></span>
              <span className="term-btn maximize"></span>
            </div>
            <div className="terminal-title">gdatta@portfolio:~</div>
          </div>
          <div
            className="terminal-body"
            id="terminalBody"
            ref={terminalBodyRef}
            onClick={() => terminalInputRef.current && terminalInputRef.current.focus()}
          >
            <div id="terminalHistory">
              {terminalHistory.map((line, idx) => {
                if (line.type === "raw") {
                  return (
                    <div
                      key={idx}
                      className="term-text"
                      dangerouslySetInnerHTML={{ __html: line.text }}
                    />
                  );
                }
                return (
                  <p key={idx} className={`term-text ${line.type}`}>
                    <span dangerouslySetInnerHTML={{ __html: line.text }} />
                  </p>
                );
              })}
            </div>
            <div className="terminal-input-line">
              <span className="terminal-prompt">gdatta@portfolio:~$</span>
              <input
                type="text"
                id="terminalInput"
                ref={terminalInputRef}
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    executeCommand(terminalInput);
                    setTerminalInput("");
                  }
                }}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROJECT DETAILS MODAL ================= */}
      {activeProject && (() => {
        const details = projectDetails[activeProject];
        if (!details) return null;
        return (
          <div className="modal-overlay active" onClick={(e) => e.target.classList.contains("modal-overlay") && setActiveProject(null)}>
            <div className="modal-card animate-slide-up">
              <button className="modal-close" onClick={() => setActiveProject(null)}>
                &times;
              </button>
              <div className="modal-body">
                <img src={details.image} alt={details.title} />
                <div className="modal-info">
                  <h2>{details.title}</h2>
                  <div className="tech-stack modal-tech">
                    {details.tech.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>
                  <h3>About the Project</h3>
                  <p>{details.description}</p>
                  <h3>Key Contributions & Challenges</h3>
                  <ul>
                    {details.challenges.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                  <div className="modal-actions">
                    {details.demoUrl !== "#" && (
                      <a href={details.demoUrl} className="project-btn" target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    )}
                    <a
                      href={details.githubUrl}
                      className="project-btn secondary-project-btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact">
        <h1>Let's Connect</h1>
        <p className="contact-subtitle">
          Open to internships, collaborations, and exciting Full Stack Development
          opportunities.
        </p>

        <div className="contact-container">
          {/* LEFT SIDE */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              Whether you have a project idea, internship opportunity, or simply
              want to connect, feel free to reach out. I’m always open to
              learning, collaborating, and building innovative digital solutions.
            </p>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <Mail size={22} />
              </div>
              <div>
                <h3>Email</h3>
                <a href="mailto:dattahotur369@gmail.com">dattahotur369@gmail.com</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <GithubIcon />
              </div>
              <div>
                <h3>GitHub</h3>
                <a href="https://github.com/dattahotur" target="_blank" rel="noreferrer">
                  github.com/dattahotur
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <LinkedinIcon />
              </div>
              <div>
                <h3>LinkedIn</h3>
                <a href="#" target="_blank" rel="noreferrer">
                  linkedin.com/in/yourprofile
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <MapPin size={22} />
              </div>
              <div>
                <h3>Location</h3>
                <p>Andhra Pradesh, India</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="contact-form">
            <form id="contactForm" onSubmit={handleFormSubmit}>
              <div className="input-group">
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                id="subject"
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />

              <textarea
                id="message"
                rows="7"
                placeholder="Write Your Message..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <Send size={18} className="btn-icon" />
              </button>

              {formStatus.message && (
                <p
                  style={{
                    marginTop: "15px",
                    color: formStatus.type === "success" ? "#22c55e" : "#ef4444",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="footer">
        <h3>Gargeya Datta Hotur</h3>
        <p>Full Stack Developer | B.Tech Final Year Student</p>
        <div className="footer-links">
          <a href="https://github.com/dattahotur" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:dattahotur369@gmail.com">Email</a>
        </div>
        <p className="copyright">
          © 2026 Gargeya Datta Hotur. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
