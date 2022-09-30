import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from "./firebase";
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import { Button, Input, Box, Modal } from '@mui/material';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(( authUser ) => {
      if (authUser) {
        // User has logged in ..
        setUser(authUser);
      } else {
        setUser(null);
        // User has logged out ..
      }
    })

    return () => {
      // Perform some cleanup action
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})))
  })
  }, []);

  const signUp = event => {
    event.preventDefault();
  
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

      setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
          open={open}
          onClose={() => setOpen(false)}
      >
          <Box sx={style}>
            <form className="app__signup">
              <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" 
                alt=""
                />
              </center>
              <Input 
                  type="text"
                  placeholder="username"
                  value={ username }
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input 
                  type="text"
                  placeholder="email"
                  value={ email }
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="password"
                  value={ password }
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={ signUp }>Sign Up</Button>
            </form>
          </Box>
      </Modal>
      <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
      >
          <Box sx={style}>
            <form className="app__signup">
              <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" 
                alt=""
                />
              </center>
                <Input 
                  type="text"
                  placeholder="email"
                  value={ email }
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="password"
                  value={ password }
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={ signIn }>Sign In</Button>
            </form>
          </Box>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" 
          alt=""
          />

        { user ? (
                <Button onClick={ () => auth.signOut() }>Logout</Button>
                  ) : (
                <div className="login__container">
                  <Button onClick={ () => setOpenSignIn(true) }>Sign In</Button>
                  <Button onClick={ () => setOpen(true) }>Sign Up</Button>
                </div>
                      ) 
        }
      </div>

      {/* Post */}

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post
                key={ id }
                postId={ id }
                user={ user }
                username={ post.username }
                caption={ post.caption }
                imageUrl={ post.imageUrl } 
              />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {
        user?.displayName ? 
        (<ImageUpload username={ user.displayName } />) :
        (<h3>Sorry you neet to login to upload</h3>)
      }

    </div>
  );
}

export default App;
