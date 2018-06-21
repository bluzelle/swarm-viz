import * as THREE from 'three';

export class Globe {
    private PI_HALF = Math.PI / 2;
    private DEFAULT_MOVEMENT = 0.002;
    private POINTS_RENDER_FACTOR = 50;

    opts = {};
    imgDir = '';
    width = 435;
    height = 800;
    private camera = null;
    private scene = null;
    private renderer = null;
    private mesh = null;
    private container = null;
    private distance = 2500;
    private mouseOnDown = { x: 0, y: 0 };
    private targetOnDown = { x: 0, y: 0 };
    private mouseMove = this.onMouseMove.bind(this);
    private mouseUp = this.onMouseUp.bind(this);
    private mouseOut = this.onMouseUp.bind(this);
    private points = [];
    private movement = this.DEFAULT_MOVEMENT;


    constructor(container, opts) {
        this.container = container;
        this.opts = opts || this.opts;
        this.imgDir = opts.imgDir || this.imgDir;
        this.width = opts.width || this.width;
        this.height = opts.height || this.height;
        const shaders = {
            'earth' : {
                uniforms: {
                'texture': { type: 't', value: null }
                },
                vertexShader: [
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                    'vNormal = normalize( normalMatrix * normal );',
                    'vUv = uv;',
                '}'
                ].join('\n'),
                fragmentShader: [
                'uniform sampler2D texture;',
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                    'vec3 diffuse = texture2D( texture, vUv ).xyz;',
                    'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                    'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
                    'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
                '}'
                ].join('\n')
            },
            'atmosphere' : {
                uniforms: {},
                vertexShader: [
                'varying vec3 vNormal;',
                'void main() {',
                    'vNormal = normalize( normalMatrix * normal );',
                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
                ].join('\n'),
                fragmentShader: [
                'varying vec3 vNormal;',
                'void main() {',
                    'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
                    'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
                '}'
                ].join('\n')
            }
        };
        const self = this;
        new THREE.TextureLoader().load(this.imgDir, function ( texture ) {
            self.init(texture, shaders);
            self.animate();
        });

        this.container.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    private init(texture, shaders) {
      this.container.style.color = '#fff';
      this.container.style.font = '13px/20px Arial, sans-serif';
      let shader, uniforms, material;
      this.camera = new THREE.PerspectiveCamera(22, this.width / this.height, 1, 10000);
      this.camera.position.z = this.distance;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0x1c588a );

      this.scene.rotation.y = 2.3;

      const geometry = new THREE.SphereGeometry(this.width, 100, 70);
      shader = shaders['earth'];
      uniforms = THREE.UniformsUtils.clone(shader.uniforms);

      uniforms['texture'].value = texture;
      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.rotation.y = Math.PI;
      this.scene.add(this.mesh);
      shader = shaders['atmosphere'];
      uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.scale.set( 1.05, 1.05, 1.05 );
      this.scene.add(this.mesh);
      const box = new THREE.BoxGeometry(0.75, 0.75, 1);
      box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));

      this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      this.renderer.setSize(this.width, this.height);

      this.container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize.bind(this), false);

      const self = this;
    }

    private onWindowResize( event ) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    private onMouseDown(event) {
        event.preventDefault();
        this.movement = 0;

        this.container.addEventListener('mousemove', this.mouseMove, false);
        this.container.addEventListener('mouseup', this.mouseUp, false);
        this.container.addEventListener('mouseout', this.mouseOut, false);

        this.mouseOnDown.x = event.clientX;
        this.mouseOnDown.y = event.clientY;

        this.targetOnDown.x = this.scene.rotation.x;
        this.targetOnDown.y = this.scene.rotation.y;

        this.container.style.cursor = 'move';
    }

    private onMouseMove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        this.scene.rotation.y = this.targetOnDown.y + (mouseX - this.mouseOnDown.x) * 0.005;
        this.scene.rotation.x = this.targetOnDown.x + (mouseY - this.mouseOnDown.y) * 0.005;
        console.log(this.scene.rotation);
    }

    private onMouseUp(event) {
        this.movement = this.DEFAULT_MOVEMENT;
        this.container.removeEventListener('mousemove', this.mouseMove, false);
        this.container.removeEventListener('mouseup', this.mouseUp, false);
        this.container.removeEventListener('mouseout', this. mouseOut, false);
        this.container.style.cursor = 'auto';
    }

    private onMouseOut(event) {
        this.container.removeEventListener('mousemove', this.mouseMove, false);
        this.container.removeEventListener('mouseup', this.mouseUp, false);
        this.container.removeEventListener('mouseout', this. mouseOut, false);
    }



    addPoint(lat: number, lng: number, value: number){
        this.points.push({
            lat: lat,
            lng: lng,
            value: value
        });
    }

    private renderPointsRec(points,delay,steps){
        const self = this;
        const head = points.slice(0,steps);
        const tail = points.slice(steps);
        if(tail.length > 0){
            setTimeout(()=>{
                head.forEach((h)=>{
                    self.renderPoint(h, self.scene);
                });
                self.renderPointsRec(tail,delay,steps);
            },delay)   
        }
    }

    renderPoints(){
        this.renderPointsRec(this.points, 10,this.points.length /this.POINTS_RENDER_FACTOR);
    }

    private renderPoint(pointData, parent) {
        const color = (0xFFFFFF << 0);
        const geometry = new THREE.BoxGeometry( 1, 1, pointData.value * 600 );
        const material = new THREE.MeshBasicMaterial( {color: new THREE.Color( color )} );
        const cylinder = new THREE.Mesh( geometry, material );

        const phi = (90 - pointData.lat) * Math.PI / 180;
        const theta = (180 - pointData.lng) * Math.PI / 180;
        cylinder.position.x = this.width * Math.sin(phi) * Math.cos(theta);
        cylinder.position.y = this.width * Math.cos(phi);
        cylinder.position.z = this.width * Math.sin(phi) * Math.sin(theta);
        cylinder.lookAt(this.mesh.position);

        if (cylinder.matrixAutoUpdate) {
            cylinder.updateMatrix();
        }
        parent.add(cylinder);
    }

    animate() {
        if (this.scene != null) {
            this.scene.rotation.y += this.movement;
            this.render();
        }
        setTimeout(this.animate.bind(this), 20);
    }

    render() {
        const posLook = {x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z};
        this.camera.position.x = -250;
        this.renderer.render(this.scene, this.camera);
    }
}
