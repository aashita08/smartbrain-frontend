import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import Particles from 'react-particles-js';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import './App.css';
import { Component } from 'react';

const particleOptions={
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "move": {
      "enable": true,
      "speed": 5,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 30,
        "size_min": 0.1,
        "sync": false
      }
    }
  }
}

const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn:false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state=initialState;
  }

  loadUser=(data)=>{    
    this.setState({user:{
        id:data.id,
        email:data.email,
        name:data.name,
        entries:data.entries,
        joined:data.joined
      }})
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol:clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width -(clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }

  onInputChange=(event) =>{
    this.setState({input : event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input});
    fetch('https://fast-peak-90928.herokuapp.com/imageUrl',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                input:this.state.input,
            })
        })
        .then(response=>response.json())
    .then(response =>{
        if(response){
          fetch('https://fast-peak-90928.herokuapp.com/image',{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                id:this.state.user.id,
              })
        })
        .then(response=>response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      })
        .catch(err=>console.log(err));
  }

  onRouteChange =(route)=>{
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles'
                params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {
          this.state.route === 'home' ? 
          <div> 
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}
                  />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          : (
            this.state.route === 'register' ?
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          
          )
      }
      </div>
    );
  } 
}

export default App;
