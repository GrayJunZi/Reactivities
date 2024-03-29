import { makeAutoObservable, reaction } from "mobx";
import { format } from "date-fns";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        );
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            const date = format(activity.date!, 'yyyy-MM-dd HH:mm:ss');
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: Activity[]; }));
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    };

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    };

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'startDate')
                    this.predicate.delete(key);
            });
        };
        switch (predicate) {
            case "all":
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case "isGoing":
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case "isHost":
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case "startDate":
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    };

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Activities.list(this.axiosParams);
            result.data.forEach(activity => {
                this.setActivity(activity);
            });
            this.setPagination(result.pagination);
        } catch (error) {

        }
        this.setLoadingInitial(false);
    };



    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (!activity) {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.detail(id);
                this.setActivity(activity);
            } catch (error) {
                console.log(error);
            }
        }
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
    };

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(x => x.userName === user.userName);
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(x => x.userName === activity.hostUserName);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    };

    cancelSeletedActivity = () => {
        this.selectedActivity = undefined;
    };

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSeletedActivity();
        this.editMode = true;
    };

    closeForm = () => {
        this.editMode = false;
    };

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user?.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            this.selectedActivity = newActivity;
        } catch (error) {
            console.log(error);
        }
    };

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            if (activity.id) {
                let updatedActivity = { ...this.getActivity(activity.id), ...activity };
                this.activityRegistry.set(activity.id, updatedActivity as Activity);
                this.selectedActivity = activity as Activity;
            }
        } catch (error) {
            console.log(error);
        }
    };

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            if (this.selectedActivity?.isGoing) {
                this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.userName !== user?.userName);
                this.selectedActivity.isGoing = false;
            } else {
                const attendee = new Profile(user!);
                this.selectedActivity?.attendees?.push(attendee);
                this.selectedActivity!.isGoing = true;
            }
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    };

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            });
        });
    };
};