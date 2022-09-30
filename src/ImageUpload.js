import { Button } from '@mui/material';
import React, { useState } from 'react';
import { db, storage } from "./firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import "./ImageUpload.css";

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = _ => {
        // const uploadTask = storage.ref(`images/${ image.name }`).put(image);
        const storageRef = ref(storage, `/images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
     
                // update progress
                setProgress(progress);
            },
            (error) => {
                // Error function
                alert(error.message);
            },
            () => {
                // Complete function
                // storage
                //     .ref("images")
                //     .child(image.name)
                //     .getDownloadURL()
                //     .then(url => {
                //         // Post image inside db
                //         db.collection("posts").add({
                //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                //             caption: caption,
                //             imageUrl: url,
                //             username: username
                //         });

                //         setProgress(0);
                //         setCaption("");
                //         setImage(null);
                //     })
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username 
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    }
 
    return (
        <div className="imageupload">
            {/* I Want to have ... */}
            {/* Caption input */}
            {/* File Picker */}
            {/* Post Button */}
            <progress className="imageupload__progress" value={ progress } max="100" />
            <input type="text" placeholder="Enter a caption..." onChange={ event => setCaption(event.target.value) } value={ caption } />
            <input type="file" onChange={ handleChange } accept="/images/*" />
            <Button onClick={ handleUpload }>Upload</Button>
        </div>
    )
}

export default ImageUpload;