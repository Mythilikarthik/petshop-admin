const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const API_BASE = process.env.NODE_ENV === "production"
  ? "https://petshop-admin.onrender.com"
  : "http://localhost:5000";
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({username, password}, {rejectWithValue}) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/user/login`, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({username, password})
            })
            const data = await res.json()
            if(!res.ok) {
                return rejectWithValue(data.message)
            }
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const initialState = {
    user: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { 
        logout : (state) => {
            state.user = null;
        }   
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }) 
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const {logout} = authSlice.actions
export default authSlice.reducer