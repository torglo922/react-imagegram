import React, { Component } from 'react';
import '../App.css';
import { Route, Switch } from 'react-router-dom';
import Profile from './Profile.js';
import Home from './Home.js';
import Photo from './Photo';
import Login from './Login.js';

var DefaultAvatar = 'https://i.postimg.cc/FHh1RDbt/128px-Creative-Tail-Animal-kangoroo-svg.png';



class App extends Component {
    state = {
        currentUser: {},
        users:[],
        posts:[],
        sorting:'timestamp',
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = () => {
        const {users,posts} = this.state;
        let user;
        let singlePost;
        const url = `https://www.mocky.io/v2/5c0f81d23100005c1324ec9c`;

        //fetch data from foursquare
        fetch(url)
        .then((response) => {
            console.log(response.status);
            response.json().then((data) => {
                if (response.status === 200) {
                  console.log('API Call Successful');
                    data.forEach((item, i) => {
                        user = {id:item.id, name:item.name, following:item.following, followers: item.followers, avatar: item.avatar ? item.avatar : DefaultAvatar}
                        user['liked'] = [];
                        item.posts.forEach((post, i) => {
                            singlePost = {id:post.id, userid:item.id, likes: post.likes, timestamp: post.timestamp, imageUrl:post.imageUrl}
                            posts.push(singlePost);
                        });
                        users.push(user);
                    });
                } else {
                    console.log('Sorry, Unable to retrieve data from API');
                }
            this.setState({users,posts});
            console.log(users);
        }).catch((error) => {
            console.log('Call is Not Successful '+error);
        })
      }).catch((error) => {
            console.log('API Not Responding'+error)
        });

    }

    updateSorting = (sort) => {
        this.setState({sorting: sort})
    }

    updateCurrentUser = (userid) => {
        const {users, currentUser} = this.state;
        let newUser;
        users.forEach((user)=>{
            if(user.id === userid){
                newUser = user;
            }
        });
        this.setState({currentUser:newUser})
    }

    getUser = (userid) => {
        const {users} = this.state;
        let user;
        users.some((u) => {
            if(u.id === userid){
                user = u;
                return true;
            }
            return false;
        });
        return user;
    }

    deletePost = (postid) => {
        const {posts, currentUser} = this.state;
        posts.some((post, i) => {
            if(post.id === postid){
                if(post.userid === currentUser.id){
                    posts.splice(i,1);
                    return true;
                }else{
                    return true;
                }
            }
            return null;
        });
        this.setState({posts});
    }

    postLiker = (postid) => {
        const {posts, currentUser} = this.state;

        posts.some((post, i) => {
            if(post.id === postid){
                let Likedindex = currentUser.liked.indexOf(postid)
                if(!(Likedindex >= 0)){
                    post.likes += 1;
                    currentUser.liked.push(postid);
                    return null;
                }else{
                    post.likes -= 1;
                    currentUser.liked.splice(Likedindex, 1);
                    return null;
                }
            }
            return null;
        });
        this.setState({posts});
    }

    sortPosts = (sorting, posts) => {
        let sortedPosts;
        if(sorting === 'timestamp'){
            sortedPosts = posts.sort(function(obj1, obj2) {
            	return Date.parse(obj2[sorting]) - Date.parse(obj1[sorting]);
            });
        } else{
            sortedPosts = posts.sort(function(obj1, obj2) {
            	return obj2[sorting] - obj1[sorting];
            });
        }
        return sortedPosts;
    }

    render() {
        const {sorting, posts, users, currentUser} = this.state;
        let sortedPosts = this.sortPosts(sorting, posts);
        return (
            <Switch>
                <Route exact path='/' render={() => (
                    <Login
                        users = {users}
                        updateCurrentUser = {this.updateCurrentUser}
                        currentUser = {currentUser}
                    />
                )}/>
                <Route exact path='/home' render={() => (
                    <Home
                    currentUser = {currentUser}
                    posts = {sortedPosts}
                    postLiker = {this.postLiker}
                    deletePost = {this.deletePost}
                    sorting = {sorting}
                    sortPosts = {this.sortPosts}
                    getUser = {this.getUser}
                    />
                )}/>
                <Route exact path='/profile' render={() => (
                    <Profile
                    currentUser = {currentUser}
                    getUser = {this.getUser}
                    posts = {sortedPosts}
                    sorting = {sorting}
                    sortPosts = {this.sortPosts}
                    deletePost = {this.deletePost}
                    updateSorting = {this.updateSorting}
                    postLiker = {this.postLiker}
                    />
                )}/>
                <Route exact path='/photo' render={() => (
                    <Photo
                    currentUser = {currentUser}
                    deletePost = {this.deletePost}
                    postLiker = {this.postLiker}
                    getUser = {this.getUser}
                    />
                )}/>
            </Switch>
        );
        }
    }

export default App;
