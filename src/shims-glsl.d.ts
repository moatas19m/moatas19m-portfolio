// When importing shaders as raw strings
declare module '*.vs?raw' { const src: string; export default src }
declare module '*.fs?raw' { const src: string; export default src }

// (Optional) if some imports omit ?raw
declare module '*.vs'     { const src: string; export default src }
declare module '*.fs'     { const src: string; export default src }

// (Optional) generic catch-all for other ?raw assets
declare module '*?raw'    { const src: string; export default src }