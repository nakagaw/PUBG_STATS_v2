import { firebaseDB } from '../firebaseConfig'

export class Firebase {

  // firebaseDB からとってきたデータをローカルストレージに上書きでぶっこむ
  public getData = (userID: string) => {
    firebaseDB.ref('/users/').once('value')
    .then( snapshot => {
      console.log("Get data from FirebaseDB! : " + userID);
      const dbData = snapshot.val();
      // userID をローカルストレージに保存
      if(dbData[userID] !== undefined ) {
        // スタッツデータ をローカルストレージに保存
        let dbStatsDataKey: any = Object.keys(dbData[userID]);
        let dbStatsDataValue: any = Object.values(dbData[userID]);
        for (let i in dbStatsDataKey) {
          // console.log(dbStatsDataKey[i]);
          // console.log(dbStatsDataValue[i]);
          let dbStatsDataValueJSON = JSON.stringify(dbStatsDataValue[i],undefined,1);
          // console.log(dbStatsDataValueJSON);
          localStorage.setItem(dbStatsDataKey[i], dbStatsDataValueJSON);
        }
        console.log('★ All localStorage data overwritten from firebaseDB!');
      } else {
        console.log('▲ Error => Not found user on firebaseDB...');
      }
    })
    .catch( error => {
      console.log(error);
    });
  }

  // userID でテーブル作成して firebaseDB にぶっ込む
  public setData = (userID: string, allStatsData: any) => {
    firebaseDB.ref('users/' + userID).set(allStatsData)
    .then( () => {
      console.log("Update from all localStrage data to FirebaseDB! : " + userID);
    })
    .catch( error => {
      console.log(error);
    });
  }

}