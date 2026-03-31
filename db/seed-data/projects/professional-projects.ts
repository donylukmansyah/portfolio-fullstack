import { SeedProject } from "../types";

export const professionalProjects: SeedProject[] = [
  {
    id: "built-design",
    companyName: "Builtdesign",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Developed and optimized a high-performing website catering to over 4000 users, emphasizing efficiency and maintainability.",
    websiteLink: "https://builtdesign.in",
    techStack: [
      "Next.js",
      "React",
      "Node.js",
      "MongoDB",
      "GraphQL",
      "Nest.js",
      "Typescript",
    ],
    startDate: new Date("2021-07-01"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/builtdesign/logo.png",
    pagesInfoArr: [
      {
        title: "Landing Page",
        description:
          "Modern and responsive landing page showcasing company services and portfolio",
        imgArr: [
          "/projects/builtdesign/landing_1.webp",
          "/projects/builtdesign/landing_3.webp",
          "/projects/builtdesign/landing_5.webp",
          "/projects/builtdesign/landing_6.webp",
          "/projects/builtdesign/landing_2.webp",
          "/projects/builtdesign/landing_4.webp",
        ],
      },
      {
        title: "Custom PDF Reader and optimizer",
        description:
          "Specialized PDF viewer with optimization features for improved performance and user experience",
        imgArr: ["/projects/builtdesign/pdf_opt.webp"],
      },
      {
        title: "Clients Dashboard",
        description:
          "Comprehensive client portal with project tracking, document management, and communication tools",
        imgArr: [
          "/projects/builtdesign/cli_dashboard_1.webp",
          "/projects/builtdesign/cli_dashboard_2.webp",
          "/projects/builtdesign/cli_dashboard_3.webp",
        ],
      },
      {
        title: "Admin Dashboard",
        description:
          "Powerful administrative interface for managing users, projects, and system settings",
        imgArr: ["/projects/builtdesign/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "During my time at Builtdesign, I had the opportunity to work on a dynamic and user-focused project that involved designing and optimizing a website catering to a user base of over 4000 individuals. My role as a full-stack web developer was to ensure a seamless experience for users by creating an efficient and maintainable platform.",
        "I collaborated closely with the product team to integrate cutting-edge features, employing technologies like Next.js and React with TypeScript for captivating front-end experiences. Additionally, I contributed significantly to the backend by utilizing Node.js, MongoDB, and GraphQL to design robust APIs and ensure smooth system functionality.",
        "This experience allowed me to enhance my skills in various areas of web development and deliver a high-quality product. I gained proficiency in front-end technologies such as Material UI and Tailwind CSS, as well as backend technologies including Nest.js and MySQL. The project's success in catering to a large user base and providing an intuitive user interface has further motivated me to pursue excellence in web development.",
      ],
      bullets: [
        "Developed and optimized a high-performing website catering to over 4000 users.",
        "Collaborated closely with the product team to implement cutting-edge features.",
        "Created an intuitive admin dashboard to efficiently manage and announce contest winners.",
        "Leveraged Next.js, React with TypeScript for captivating front-end experiences.",
        "Utilized Node.js, MongoDB, and GraphQL to design and manage databases.",
      ],
    },
  },
  {
    id: "the-super-quotes",
    companyName: "The Super Quotes",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Elevated The Super Quotes app with JavaScript, React Native, APIs, Redux magic, and Google Play Store debut.",
    websiteLink:
      "https://play.google.com/store/apps/details?id=com.thesuperlife",
    techStack: ["React Native", "Node.js", "MongoDB", "Javascript"],
    startDate: new Date("2021-07-01"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/superquotes/logo.png",
    pagesInfoArr: [
      {
        title: "Quotes View Page",
        description:
          "Elegantly designed quotes display with customizable themes and sharing options",
        imgArr: ["/projects/superquotes/app_2.webp"],
      },
      {
        title: "Quotes Download Component",
        description:
          "Feature allowing users to download quotes as beautiful images for social media sharing",
        imgArr: [
          "/projects/superquotes/app_4.webp",
          "/projects/superquotes/app_7.webp",
        ],
      },
      {
        title: "Account Management",
        description:
          "User profile management with favorites, history, and personalization settings",
        imgArr: ["/projects/superquotes/app_6.webp"],
      },
      {
        title: "Interest Selection and Update Page",
        description:
          "Interactive interface for users to select and update their quote preferences and interests",
        imgArr: [
          "/projects/superquotes/app_1.webp",
          "/projects/superquotes/app_3.webp",
        ],
      },
      {
        title: "Responsiveness",
        description:
          "Adaptive design ensuring optimal user experience across various device sizes and orientations",
        imgArr: ["/projects/superquotes/app_5.webp"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Venturing into the world of creativity at The Super Quotes was an exhilarating journey. As a passionate developer, I led the charge in crafting a compelling application from inception to completion, using the dynamic duo of JavaScript and React Native.",
        "The heart of my achievement lay in the seamless integration of APIs, threading a tapestry of data flow that propelled the application's functionality to new heights.",
        "With the wizardry of Redux, I choreographed a symphony of state management and performance optimization, orchestrating a ballet of responsiveness that wowed users with every interaction.",
        "A crescendo awaited as I unveiled the culmination of my work on the grand stage of the Google Play Store. The app's debut marked an epoch, opening doors to an expansive audience eager to embrace the charm of The Super Quotes.",
      ],
      bullets: [
        "Led the end-to-end development of a captivating application using JavaScript and React Native.",
        "Championed the integration of APIs, harmonizing data flow and enhancing application functionality.",
        "Conducted Redux magic to ensure state management and optimize performance, delivering a mesmerizing user experience.",
        "Premiered the application on the Google Play Store, capturing hearts and expanding its user base.",
      ],
    },
  },
  {
    id: "builtdesign-blogs",
    companyName: "Builtdesign Blogs",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Crafted Builtdesign's vibrant Blogs Website using Netlify CMS and React for engaging content experiences.",
    websiteLink: "https://blog.builtdesign.in",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Typescript"],
    startDate: new Date("2022-03-01"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/builtdesign-blogs/logo.png",
    pagesInfoArr: [
      {
        title: "Blog Landing Page",
        description:
          "Modern and responsive landing page showcasing featured articles",
        imgArr: ["/projects/builtdesign-blogs/blog_2.webp"],
      },
      {
        title: "Blog Listing",
        description:
          "Organized display of all blog posts with search and filtering",
        imgArr: ["/projects/builtdesign-blogs/blog_3.webp"],
      },
      {
        title: "Category Navigation",
        description: "Intuitive category-based navigation system",
        imgArr: ["/projects/builtdesign-blogs/blog_1.webp"],
      },
      {
        title: "Article View",
        description:
          "Clean and readable article layout with rich media support",
        imgArr: [
          "/projects/builtdesign-blogs/blog_4.webp",
          "/projects/builtdesign-blogs/blog_5.webp",
        ],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "As part of the Builtdesign platform, I developed a sophisticated blog website that serves as a content hub for the company's thought leadership and industry insights. The project leveraged Next.js and React to create a fast, SEO-friendly platform.",
        "The blog platform features a modern, responsive design that prioritizes readability and user engagement. I implemented a robust content management system using Netlify CMS, enabling the content team to easily publish and manage blog posts.",
        "The architecture includes server-side rendering for optimal performance and SEO, while MongoDB provides flexible content storage. TypeScript ensures code reliability and maintainability throughout the application.",
        "Key features include category-based navigation, search functionality, and a rich text editor for content creation. The platform supports various content types including images, code snippets, and embedded media.",
      ],
      bullets: [
        "Developed a modern blog platform using Next.js and React with TypeScript",
        "Implemented Netlify CMS for efficient content management",
        "Created a responsive design that prioritizes readability and user engagement",
        "Built server-side rendering for optimal performance and SEO",
        "Integrated MongoDB for flexible content storage and management",
        "Developed category-based navigation and search functionality",
        "Implemented rich text editing capabilities for content creation",
      ],
    },
  },
];
