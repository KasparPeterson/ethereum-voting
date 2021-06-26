import React, {Component} from 'react'
import Web3 from 'web3'
import PresidentElections from '../abis/PresidentElections.json'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            contractName: "",
            contractAddress: "",
            trumpVotes: 0,
            bidenVotes: 0,
            presidentElectionsContract: null
        }
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        const networkId = await web3.eth.net.getId()

        // Load DaiToken
        const presidentElectionsData = PresidentElections.networks[networkId]
        if (presidentElectionsData) {
            const presidentElections = new web3.eth.Contract(
                PresidentElections.abi, presidentElectionsData.address);
            this.setState({presidentElectionsContract: presidentElections})
            let name = await presidentElections.methods.name().call();
            this.setState({
                contractName: name,
                contractAddress: presidentElectionsData.address
            })
            await this.loadVoteData()
        } else {
            window.alert('PresidentElections contract not deployed to detected network.')
        }
    }

    async loadVoteData() {
        let trumpVotes = await this.state.presidentElectionsContract.methods.getVotes("0").call();
        let bidenVotes = await this.state.presidentElectionsContract.methods.getVotes("1").call();
        this.setState({
            trumpVotes: trumpVotes,
            bidenVotes: bidenVotes
        })
    }

    async voteTrump() {
        await this.voteAndReload("0")
    }

    async voteBiden() {
        await this.voteAndReload("1")
    }

    async voteAndReload(vote) {
        await this.state.presidentElectionsContract.methods.vote(vote)
            .send({from: this.state.account})
        await this.loadVoteData()
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <h2>Voting contract</h2>
                    <p>Name: <b>"{this.state.contractName}"</b></p>
                    <p>Address: <b>"{this.state.contractAddress}"</b></p>
                    <h3>Results:</h3>
                    <p>Trump votes: {this.state.trumpVotes}</p>
                    <p>Biden votes: {this.state.bidenVotes}</p>
                    <h3>Voting cabin</h3>
                    <button onClick={() => this.voteTrump()}>I vote Trump</button>
                    <button onClick={() => this.voteBiden()}>I vote Biden</button>
                </div>
            </div>
        );
    }
}

export default App;
