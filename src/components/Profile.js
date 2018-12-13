import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import ImageGrid from './ImageGrid';
import Header from './Header';
import ProfileInfo from './ProfileInfo';
import '../sass/style.scss';

class Profile extends Component {

    getProfile = () => {
        let userid = this.props.match.params.userid;
        let user;
        if(userid){
            user = this.props.getUser(userid);
        }else{
            user = this.props.currentUser;
        }
        return user;
    }

    filterPosts = (posts, user) => {
        let filteredPosts = [];
        posts.map((post, i) =>{
            if(post.userid === user.id)
                filteredPosts.push(post);
        });
        return filteredPosts;
    }

    render() {
        const {sorting, updateSorting, sortPosts, posts, deletePost, postLiker, currentUser} = this.props;


        if(Object.keys(this.props.currentUser).length === 0){
            console.log('not logged in!'+this.props.currentUser);
            return <Redirect to='/' />;
        }

        let user = this.getProfile();
        let profilePosts = this.filterPosts(posts, user);
        let finalPosts = this.props.sortPosts(sorting, profilePosts);

        return (
        <div className="main">
            <Header
            posts = {posts}
            currentUser = {currentUser}
            />
            <ProfileInfo
            user = {user}
            sorting = {sorting}
            updateSorting = {updateSorting}
            />
            <ImageGrid
            posts = {finalPosts}
            postLiker = {postLiker}
            user = {user}
            />
        </div>
        );
    }
}

export default Profile;
