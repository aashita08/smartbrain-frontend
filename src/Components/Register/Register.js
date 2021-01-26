import React from 'react';

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state={
            signInEmail:'',
            signInPassword:'',
            name:''
        }
    }
    OnEmailChange=(event)=>{
        this.setState({email:event.target.value})
    }
    OnPasswordChange=(event)=>{
        this.setState({password:event.target.value})
    }
    OnNameChange=(event)=>{
        this.setState({name:event.target.value})
    }

    onSubmitSignIn=()=>{
        fetch('https://fast-peak-90928.herokuapp.com/register',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:this.state.email,
                name:this.state.name,
                password:this.state.password
                
            })
        })
        .then(response=>response.json())
        .then(user=>{
            if(user.id){
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        })
}

    render()
    {
        const {onRouteChange}=this.props;
        return(
            <article className="br5 ba b--black-10 mv4 w-100 w-50-m w-25-l mw7 shadow-5 center pa4 mv6">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="text" 
                                name="name"  
                                id="name"
                                onChange={this.OnNameChange}
                             />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address"
                                onChange={this.OnEmailChange}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password" 
                                name="password"  
                                id="password"
                                onChange={this.OnPasswordChange}
                             />
                        </div>
                        </fieldset>
                        <div className="">
                        <input onClick={()=>this.onSubmitSignIn()} className="b pa2 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
                        </div>
                     </div>
                </main>
            </article>
    
        )
    } 
}   


export default Register;