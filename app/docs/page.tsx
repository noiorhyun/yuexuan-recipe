'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    SwaggerUIBundle: any;
    SwaggerUIStandalonePreset: any;
  }
}

export default function SwaggerUI() {
  useEffect(() => {
    // Load Swagger UI
    const swaggerScript = document.createElement('script');
    swaggerScript.src = 'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js';
    swaggerScript.async = true;
    document.body.appendChild(swaggerScript);

    const standaloneScript = document.createElement('script');
    standaloneScript.src = 'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js';
    standaloneScript.async = true;
    document.body.appendChild(standaloneScript);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css';
    document.head.appendChild(link);

    const customStyle = document.createElement('style');
    customStyle.textContent = `
      .swagger-ui { background: #ffffff; }
      .swagger-ui .info { background: #ffffff; }
      .swagger-ui .scheme-container { background: #ffffff; }
      .swagger-ui .wrapper { background: #ffffff; }
      .swagger-ui .opblock { background: #ffffff; }
      .swagger-ui .opblock .opblock-summary { background: #f6f6f6; }
      .swagger-ui .opblock .opblock-summary:hover { background: #e6e6e6; }
      .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97,175,254,.1); }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73,204,144,.1); }
      .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252,161,48,.1); }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249,62,62,.1); }
      .swagger-ui .btn { color: #333; }
      .swagger-ui .btn.execute { background: #4990e2; color: white; }
      .swagger-ui .topbar { display: none; }
      .swagger-ui input[type=text] { color: #000000; }
      .swagger-ui input[type=text]::placeholder { color: #666666; }
    `;
    document.head.appendChild(customStyle);

    const initializeSwagger = () => {
      if (window.SwaggerUIBundle && window.SwaggerUIStandalonePreset) {
        // @ts-ignore
        window.SwaggerUIBundle({
          url: '/api/docs',
          dom_id: '#swagger-ui',
          presets: [
            // @ts-ignore
            window.SwaggerUIBundle.presets.apis,
            // @ts-ignore
            window.SwaggerUIStandalonePreset
          ],
          layout: "BaseLayout",
          deepLinking: true,
          displayOperationId: false,
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          defaultModelRendering: 'example',
          displayRequestDuration: true,
          docExpansion: 'list',
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          tryItOutEnabled: true,
          syntaxHighlight: {
            activate: true,
            theme: 'agate'
          }
        });
      }
    };

    // Check if both scripts are loaded
    const checkScripts = setInterval(() => {
      if (window.SwaggerUIBundle && window.SwaggerUIStandalonePreset) {
        clearInterval(checkScripts);
        initializeSwagger();
      }
    }, 100);

    return () => {
      document.body.removeChild(swaggerScript);
      document.body.removeChild(standaloneScript);
      document.head.removeChild(link);
      document.head.removeChild(customStyle);
      clearInterval(checkScripts);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div id="swagger-ui" />
    </div>
  );
} 