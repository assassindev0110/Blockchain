import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";

// function App() {
//   return (
//     <EthProvider>
//       <div id="App">
//         <div className="container">
//           <Intro />
//           <hr />
//           <Setup />
//           <hr />
//           <Demo />
//           <hr />
//           <Footer />
//         </div>
//       </div>
//     </EthProvider>
//   );
// }

// export default App;


import React, { Component } from "react"; 
import ItemManager from "./contracts/ItemManager.json"; 
import Item from "./contracts/Item.json"; 
import getWeb3 from "./getWeb3"; 
// import "./App.css";

class App extends Component 
{ 
  state = {cost: 0, itemName: "exampleItem1", loaded:false};

  componentDidMount = async () => 
    { 
      try { 
        // Get network provider and web3 instance. 
        this.web3 = await getWeb3();
        
        // Use web3 to get the user's accounts. 
        this.accounts = await this.web3.eth.getAccounts();
        
        // Get the contract instance.
        const networkId = await this.web3.eth.net.getId();
        
        this.itemManager = new this.web3.eth.Contract( 
          ItemManager.abi, 
          ItemManager.networks[networkId] && ItemManager.networks[networkId].address, 
        ); 
        
        this.item = new this.web3.eth.Contract( 
          Item.abi, 
          Item.networks[networkId] && Item.networks[networkId].address, 
        );
        
        this.setState({loaded:true});
      } catch (error) { 
        // Catch any errors for any of the above operations. 
        alert( `Failed to load web3, accounts, or contract. Check console for details.`, ); 
        console.error(error); 
      } 
    };
    render() { 
      if (this.state.loaded) 
      {
        return <div>Loading Web3, accounts, and contract...</div>; 
      } 
      return ( 
      <div className="App">
        <div className="left" style={{width : "30%", float : "left"}}>
          <h1>Simply Payment/Supply Chain Example!</h1> 
          <h2>Items</h2>
          <h2>Add Element</h2> 
            Cost: 
            <input type="text" name="cost" placeholder={this.state.cost} onChange={this.handleInputChange} /> 
            Item Name: 
            <input type="text" name="itemName" placeholder={this.state.itemName} onChange={this.handleInputChange} /> 
          <button type="button" onClick={this.handleSubmit}>
            Create new Item
          </button>         
        </div> 
        <div className="right" style={{width : "70%", float : "right"}}>
          <EthProvider>
            <div id="">
              <div className="container">
                <Intro />
                <hr />
                <Setup />
                <hr />
                <Demo />
                <hr />
                <Footer />
              </div>
            </div>
          </EthProvider>
        </div>
      </div> 
      ); 
    }

    handleSubmit = async () => 
      { 
        const { cost, itemName } = this.state; 
        console.log(itemName, cost, this.itemManager); 
        let result = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] }); 
        console.log(result); 
        alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._address); 
      };
    
    handleInputChange = (event) => 
      { 
        const target = event.target; 
        const value = target.type === 'checkbox' ? target.checked : target.value; 
        const name = target.name;
        this.setState({ [name]: value }); 
      };
}
export default App;