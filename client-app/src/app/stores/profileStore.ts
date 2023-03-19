import { makeAutoObservable, reaction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        );
    }

    setActivityTab = (activeTab: any) => {
        this.activeTab = activeTab;
    };

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.userName;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            this.profile = profile;
        } catch (error) {
            console.log(error);
        }
        this.loadingProfile = false;
    };

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            if (this.profile) {
                this.profile.photos?.push(photo);
                if (photo.isMain && store.userStore.user) {
                    store.userStore.setImage(photo.url);
                    this.profile.image = photo.url;
                }
            }
            this.uploading = false;
        } catch (error) {
            console.log(error);
        }
        this.uploading = false;
    };

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            if (this.profile && this.profile.photos) {
                this.profile.photos.find(x => x.isMain)!.isMain = false;
                this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                this.profile.image = photo.url;
            }
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            if (this.profile) {
                this.profile.photos = this.profile.photos?.filter(x => x.id !== photo.id);
            }
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };


    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            if (this.profile && this.profile.userName !== store.userStore.user?.userName && this.profile.userName === username) {
                following ? this.profile.followersCount++ : this.profile.followersCount--;
                this.profile.following = !this.profile.following;
            }
            if (this.profile && this.profile.userName === store.userStore.user?.userName) {
                following ? this.profile.followingCount++ : this.profile.followingCount--;
            }
            this.followings.forEach(profile => {
                if (profile.userName === username) {
                    profile.following ? profile.followersCount-- : profile.followersCount++;
                    profile.following = !profile.following;
                }
            });
        }
        catch (err) {
            console.log(err);
        }

        this.loading = false;
    };

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;

        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            this.followings = followings;
        } catch (error) {
            console.log(error);
        }

        this.loadingFollowings = false;
    };
}