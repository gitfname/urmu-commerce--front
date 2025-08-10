import { makeAutoObservable, runInAction } from "mobx"
import { getMyProfileQuery, type UsersSerializer } from "../services/api/ecommerce--api"

class MyProfileStore {
    profile: UsersSerializer
    isLoggedIn: boolean;
    isFetching: boolean;

    constructor() {
        makeAutoObservable(this)
    }

    async fetchMyProfile(): Promise<void> {
        runInAction(() => this.isFetching = true)

        try {
            const token = localStorage.getItem("access_token")

            if (!token) throw new Error("Jwt token not found")

            const profile = await getMyProfileQuery({
                headers: {
                    Authorization: "Bearer " + token
                }
            })

            runInAction(() => {
                this.profile = { ...profile.data }

                setTimeout(() => {
                    runInAction(() => {
                        this.isLoggedIn = true
                        this.isFetching = false
                    })
                }, 25);
            })
        } catch (error) {
            console.log("error while getting myProfile")
            console.log(error)
            console.log("End --- error while getting myProfile --- End")

            runInAction(() => {
                this.isLoggedIn = false
                this.isFetching = false
            })
        }
    }

}

const myProfileStore = new MyProfileStore()
export default myProfileStore