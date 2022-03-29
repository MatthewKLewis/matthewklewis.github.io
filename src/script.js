import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

var scrollPercent = 0
var animating = true
const HOME_ELEMENT = document.querySelector('#homeButton')
const SKILLS_ELEMENT = document.querySelector('#skillsButton')
const CONTACTS_ELEMENT = document.querySelector('#contactsButton')
const CHECK_ELEMENT = document.querySelector('#checkbox')
function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}
function getMidpointPixels() {
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return ((h[sh]||b[sh]) / 3);
}
document.addEventListener('scroll', (evt)=>{
    scrollPercent = getScrollPercent().toFixed(2)
})
HOME_ELEMENT.addEventListener('click', ()=>{ window.scrollTo({top: 0, behavior: 'smooth'})})
SKILLS_ELEMENT.addEventListener('click', ()=>{ window.scrollTo({top: getMidpointPixels(), behavior: 'smooth'})})
CONTACTS_ELEMENT.addEventListener('click', ()=>{ window.scrollTo({top: 9999999, behavior: 'smooth'})})
CHECK_ELEMENT.addEventListener('click', ()=>{ animating = !animating })

//#region [rgba(25, 128, 128, 0.15) ] RENDERER (VIEW)
/*  
* 
* This section sets up rendering.
*
*/

const scene = new THREE.Scene()
scene.background = null
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = .8;
camera.position.y = .8;
camera.position.z = .8;
scene.add(camera)
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const renderPass = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderPass)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//#endregion

//#region [rgba(200, 64, 128, 0.15) ] START (SET UP GAME)
/*  
* 
* This section sets off the game loop.
*
*/
camera.lookAt(0,0,0)
let model;
const fbxLoader = new FBXLoader()
fbxLoader.load(
    './models/hardsuit.fbx',
    (object) => {
        object.scale.set(.005, .005, .005)
        object.name = 'hardsuit';
        scene.add(object)
        model = object
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        //console.log(error)
    }
)

const geometry = new THREE.IcosahedronGeometry(.7);
const material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const light = new THREE.SpotLight(0xFFFFFF, 1);
light.position.x = 1.3
light.position.z = 1
scene.add(light);
scene.fog = new THREE.FogExp2( '#1a2b31', 0.9 );
//#endregion

//#region [rgba(255, 255, 255, 0.15) ] UPDATE
/*  
* 
* This section sets off the game loop.
*
*/

const clock = new THREE.Clock()
var timeOfLastFrame = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    if (animating) {
        model.rotateX(scrollPercent / 5000)
        model.rotateY(scrollPercent / 5000)
    }

    // Render
    composer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    timeOfLastFrame = elapsedTime
}

tick()

//#endregion