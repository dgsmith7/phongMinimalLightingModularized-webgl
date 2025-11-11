const vertexShaderSource = `#version 300 es
    
    in vec4 aPosition;
    in vec4 aNormal;
    out vec3 N, L, E;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec4 uLightPosition;
    uniform mat3 uNormalMatrix;
    
    void main()
    {
        vec3 pos = (uModelViewMatrix * aPosition).xyz;
        if(uLightPosition.a == 0.0)  
              L = normalize(uLightPosition.xyz);
        else  
              L = normalize(uLightPosition).xyz - pos;
    
        E =  -normalize(pos);
        N = normalize(uNormalMatrix*aNormal.xyz);
        gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
    
    }`;

const fragmentShaderSource = `#version 300 es
    
    precision mediump float;
    
    uniform vec4 uAmbientProduct;
    uniform vec4 uDiffuseProduct;
    uniform vec4 uSpecularProduct;
    uniform float uShininess;
    
    in vec3 N, L, E;
    out vec4 fColor;
    
    void main()
    {
    
        vec3 H = normalize( L + E );
        vec4 ambient = uAmbientProduct;
    
        float Kd = max( dot(L, N), 0.0 );
        vec4  diffuse = Kd*uDiffuseProduct;
    
        float Ks = pow( max(dot(N, H), 0.0), uShininess );
        vec4  specular = Ks * uSpecularProduct;
    
        if( dot(L, N) < 0.0 ) specular = vec4(0.0, 0.0, 0.0, 1.0);
    
        fColor = ambient + diffuse +specular;
        fColor.a = 1.0;
    
    }`;
