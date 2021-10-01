const functions = require("firebase-functions");
const admin = require("firebase-admin");
const jsdom = require("jsdom")
const {JSDOM} = jsdom
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = admin.firestore()

exports.setUserAsAdminByEmail = functions.region('europe-west1').https.onCall((data, context) => {
    if (context.auth) {
        if (context.auth.token.admin) {
            admin.auth().getUserByEmail(data.email).then(record => {
                let uid = record.uid
                admin.auth().setCustomUserClaims(uid, {admin: data.value}).then(() => {
                    console.log(`Successfully made ${data.email} an admin`)
                    return {user: data}
                }).catch((err) => {
                    console.log('Could not make a new admin: ')
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
                throw new functions.https.HttpsError('invalid-argument', 'Email not found')
            })
        } else {
            throw new functions.https.HttpsError('failed-precondition', 'You need to be logged in as an admin to make another user an admin')
        }
    } else {
        throw new functions.https.HttpsError('failed-precondition', 'You need to be logged in as an admin to make another user an admin')
    }
});

exports.checkIfUserIsAdminByEmail = functions.region('europe-west1').https.onCall((data) => {
    return admin.auth().getUserByEmail(data.email).then(record => {
        let claims = record.customClaims
        if (claims === undefined) {
            return {isAdmin: false}
        }
        return {
            isAdmin: record.customClaims['admin']
        }
    }).catch(err => {
        console.log(err)
        throw new functions.https.HttpsError('invalid-argument', 'Email not found')
    })
})

exports.createNewUserRecord = functions.region('europe-west1').https.onCall((data) => {
    const record = {
        name: data.name,
        email: data.email,
        uid: data.uid,
        roles: [],
        created: Date.now(),
        last_access: Date.now(),
        bio: 'User has not filled in a bio...',
        rowing_since: '',
        height_cm: '',
        subject: '',
        matriculation_year: '',
        photo: null
    }
    db.collection('profiles').doc(data.uid).set(record).then(() => {
        return record
    })
})

exports.updatePostCoverImage = functions.region('europe-west1').firestore.document('/posts/{postId}')
    .onWrite(async (change, context) => {
        let doc = await admin.firestore().collection('posts').doc(context.params.postId)
        let result = await doc.get()
        let html = result.data().html
        const dom = new JSDOM(html)
        const img = dom.window.document.querySelector('img')
        let coverImgUrl = ""
        const defaultImgUrl = null
        if (img) {
            coverImgUrl = img.getAttribute('src')
        } else {
            coverImgUrl = defaultImgUrl
        }
        if (result.data().coverImgURL === coverImgUrl) {
            return null
        } else {
            return admin.firestore().collection('posts').doc(context.params.postId).update({coverImgURL: coverImgUrl})
        }
    })

exports.updateOutingInCalendar = functions.region('europe-west1').firestore.document('/outings/{outingId}')
    .onWrite(async (change, context) => {
        console.log(change.before, change.after)
})
