import { createSlice } from "@reduxjs/toolkit";


export const serviceSlice = createSlice({

  name: "service",
  //we can accesss/change vars. which are in initialstate >> state.myinfo
  initialState: {
    openAddPostModal: false,
    openEditProfileModal: false,
    anchorE1: null,
    anchorE2: null,
    darkMode: false,
    myInfo: null,
    user: {},
    allPosts: [],
    postId: null,
    searchedUsers: [],
  },

  //func. to pass values in
  reducers: {

    //comp./modals/addPost.jsx
    addPostModal: (state, action) => {
      state.openAddPostModal = action.payload;
    },

    //pages./protected/profile/ProfileLayout.jsx
    editProfileModal: (state, action) => {
      state.openEditProfileModal = action.payload;
    },

    //comp./common/header.jsx
    toggleMainMenu: (state, action) => {
      state.anchorE1 = action.payload;
    },

    //comp./menu/MyMenu.jsx {menu n post 3dots(delete,etc)}
    //initialSatet:anchorE2: null,
    //in MyMenu,use {anchor2} by useSelector((state)=> state.service) then create useDispatch()
    // then create const func. handleClose() then in returnSection( use {anchor2} where needed)
    //then in comp./home/Post.jsx, Create handleOpenMenu func.,in <IoIOsMore> icon in onCLick={handleOpenMenu}
    toggleMyMenu: (state, action) => {
      state.anchorE2 = action.payload;
    },


    //initialState:darkMode: false,
    //comp./menu/MainMenu.jsx, Create handleToggleTheme() func.
    //In comp./common/Header.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{logo,StackofNavabr acc. to darkMode}

    //In comp./common/Navbar.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{<FiArrowLeft>,Link acc. to darkMode}

    //In comp./home/Post.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{<Typography>, acc. to darkMode}

    //In comp./home/post/Comments.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{<Stack>, acc. to darkMode}

    //In comp./search/Profilebar.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{<button>, acc. to darkMode}

    //In comp./search/SearchInput.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{, acc. to darkMode}

    //In ./App.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //then in returnSection{<box>, acc. to darkMode}

    //In comp./home/post/PostTwo.jsx, Access darkMode of initialstate from slice.js by useSelector()
    //create mode classname in index.css file

    toggleColorMode: (state) => {
      state.darkMode = !state.darkMode; //if toggle then false,another toggle true {payload noNeed}
    },


    //From redux/service.js
    addMyInfo: (state, action) => {
      state.myInfo = action.payload.me; //store all info in "Me" Tag
    },


    addUser: (state, action) => {
      state.user = action.payload;
    },


    addSingle: (state, action) => {
      let newArr = [...state.allPosts];
      let updatedArr = [action.payload.newPost, ...newArr]; //newPost from backend>>controllera>>postControllers
      let uniqueArr = new Set();
      let uniquePosts = updatedArr.filter((e) => {
        if (!uniqueArr.has(e._id)) {
          uniqueArr.add(e);
          return true;
        }
        return false;
      });
      state.allPosts = [...uniquePosts];
    },


    addToAllPost: (state, action) => {
      const newPostArr = [...action.payload.posts]; //(...)SpreadOperator
      if (state.allPosts.length === 0) {
        state.allPosts = newPostArr;
        return;
      }
      const existingPosts = [...state.allPosts];
      newPostArr.forEach((e) => {
        const existingIndex = existingPosts.findIndex((i) => {
          return i._id === e._id;
        });

        if (existingIndex !== -1) //(if existingIndex exist then,new one push in place of it])
        {
          existingPosts[existingIndex] = e;
        } else {
          existingPosts.push(e);
        }
      });
      state.allPosts = existingPosts;
    },


    deleteThePost: (state, action) => {
      let postArr = [...state.allPosts];
      let newArr = postArr.filter((e) => e._id !== state.postId); //return whose Id will not match postId
      state.allPosts = newArr;
    },


    addPostId: (state, action) => {
      state.postId = action.payload;
    },


    addToSearchedUsers: (state, action) => {
      state.searchedUsers = action.payload;
    },
  },
});

//all reducer func.
export const {
  addPostId,
  addPostModal,
  editProfileModal,
  toggleMainMenu,
  toggleMyMenu,
  toggleColorMode,
  addMyInfo,
  addUser,
  addSingle,
  addToAllPost,
  deleteThePost,
  addToSearchedUsers,
} = serviceSlice.actions;

export default serviceSlice.reducer;
