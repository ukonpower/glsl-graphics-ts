import * as ORE from 'ore-three-ts';
import MainScene from './MainScene';

class APP{
	private canvas: any;
	private controller: ORE.Controller;
	private scene: MainScene;

	constructor(){
		this.canvas = document.querySelector("#canvas");
        this.controller = new ORE.Controller(this.canvas,true);
        this.scene = new MainScene(this.controller.renderer);
        this.controller.setScene(this.scene);
	}
}

window.addEventListener('load',()=>{
	let app = new APP();
});