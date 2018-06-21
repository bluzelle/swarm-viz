import * as THREE from 'three';

export class Globe {
    PI_HALF = Math.PI / 2;

    opts = {};
    imgDir = '';
    width = 435;
    height = 800;
    camera = null;
    scene = null;
    renderer = null;
    mesh = null;
    container = null;
    curZoomSpeed = 0;
    rotation = {x: 0, y: 0, z: 0};
    target = {x: Math.PI * 3 / 2, y: Math.PI / 6.0};
    distance = 2300;
    distanceTarget = 2500;
    overRenderer = false;
    mouse = { x: 0, y: 0 };
    mouseOnDown = { x: 0, y: 0 };
    targetOnDown = { x: 0, y: 0 };
    mouseMove = this.onMouseMove.bind(this);
    mouseUp = this.onMouseUp.bind(this);
    mouseOut = this.onMouseUp.bind(this);
    points = [];



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

        this.container.addEventListener('mouseover', function() {
            self.overRenderer = true;
        }, false);

        this.container.addEventListener('mouseout', function() {
            self.overRenderer = false;
        }, false);

    }

    private init(texture, shaders) {
      this.container.style.color = '#fff';
      this.container.style.font = '13px/20px Arial, sans-serif';
      let shader, uniforms, material;
      this.camera = new THREE.PerspectiveCamera(22, this.width / this.height, 1, 10000);
      this.camera.position.z = this.distance;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0x1c588a );
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
      window.addEventListener('resize', this.onWindowResize, false);

      const self = this;
      this.points.forEach((p) => {
          self.renderPoint(p, self.scene);
      });
    }

    private onWindowResize( event ) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    private onMouseDown(event) {
        event.preventDefault();

        this.container.addEventListener('mousemove', this.mouseMove, false);
        this.container.addEventListener('mouseup', this.mouseUp, false);
        this.container.addEventListener('mouseout', this.mouseOut, false);

        this.mouseOnDown.x = - event.clientX;
        this.mouseOnDown.y = event.clientY;

        this.targetOnDown.x = this.target.x;
        this.targetOnDown.y = this.target.y;

        this.container.style.cursor = 'move';
    }

    private onMouseMove(event) {
        this.mouse.x = - event.clientX;
        this.mouse.y = event.clientY;

        const zoomDamp = this.distance / 1000;

        this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
        this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

        this.target.y = this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
        this.target.y = this.target.y < - this.PI_HALF ? - this.PI_HALF : this.target.y;
    }

    private onMouseUp(event) {
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

    private zoom(delta) {
        this.distanceTarget -= delta;
        this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
        this.distanceTarget = this.distanceTarget < 350 ? 350 : this.distanceTarget;
    }


    addPoint(lat: number, lng: number, value: number){
        this.points.push({
            lat: lat,
            lng: lng,
            value: value
        });
    }

    private renderPoint(pointData, parent) {
        const color = ((pointData.value) * 0xFFFFFF << 0);
        const geometry = new THREE.BoxGeometry( pointData.value, pointData.value, pointData.value );
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
            this.scene.rotation.y += 0.001;
            this.render();
        }
        setTimeout(this.animate.bind(this), 1);
    }

    render() {
        this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
        this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
        this.distance += (this.distanceTarget - this.distance) * 0.3;
        const posLook = {x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z};
        // this.camera.lookAt(this.mesh.position);
        this.camera.position.x = -250;
        /*this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
        this.camera.position.y = this.distance * Math.sin(this.rotation.y) ;
        this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);*/
        this.renderer.render(this.scene, this.camera);
    }
}
