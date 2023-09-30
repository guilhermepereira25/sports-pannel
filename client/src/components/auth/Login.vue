<script>
import { login } from '../../service/auth_service.js';

export default {
    data() {
        return {
            form: {
                username: '',
                password: ''                
            },
            loading: false,
            error: ''
        }
    },
    methods: {
        async submitLogin() {
            this.clickLoading();

            const response = await login(this.form.username, this.form.password);

            if (! response) {
                this.loading = false;
                this.error = 'Unknown error ocurred, try again later';
                return;
            }

            if (response.success === true) {
                localStorage.setItem('user', JSON.stringify(response.data.username));
                sessionStorage.setItem('token', response.data.token);
                
                window.location.href = '/#/home';
            } else {
                let responseError = response.data.message;

                switch (responseError) {
                    case 'User not found':
                        this.error = 'User not found';
                        break;
                    case 'Password incorrect':
                        this.error = 'Password incorrect';
                        break;
                    default:
                        this.error = 'Unknown error';
                        break;
                }
            }
        },
        clickLoading() {
            this.loading = false;

            setTimeout(() => {
                this.loading = true;
            }, 1000);
        }
    }
}

</script>

<template>
    <main class="form-login w-100 m-auto">
        <form v-on:submit.prevent="submitLogin">
            <img class="mb-4" src="../../assets/sports-soccer-svgrepo-com.svg" alt="" width="72" height="57">

            <h3>Please, login in sports pannel</h3>
            <div style="padding: 10px;" class="alert alert-danger" role="alert" v-if="error">
                {{ error }}
            </div>

            <div class="form-floating">
                <input type="text" v-model="form.username" placeholder="Username" class="form-control" required />
                <label for="username">Username</label>
            </div>


            <div class="form-floating">
                <input type="password" v-model="form.password" placeholder="Password" class="form-control" required />
                <label for="password">Password</label>
            </div>

            <button type="submit" class="btn btn-primary">
                <div v-if="loading" class="spinner-border spinner-border-sm">
                </div>
                <span v-if="loading"> Login in...</span>
                <span v-else> Login</span>
            </button>

        </form>
    </main>
</template>

<style scoped>

.form-floating:focus-within {
    z-index: 2;
}

.form-login h3 {
    font-weight: 100;
    margin-bottom: 1rem;
}

.form-login {
    max-width: 500px;
    padding: 1rem;
}

.form-login input[type="text"] {
    margin-bottom: -1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.form-login input[type="password"] {
    margin-bottom: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.form-login button {
    margin-top: 1rem;
    width: 100%;
    max-height: fit-content;
}

</style>