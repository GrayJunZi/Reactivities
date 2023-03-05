import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

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
}