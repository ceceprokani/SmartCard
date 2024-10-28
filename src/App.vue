<template>
  <div class="container p-3 text-white vh-100">
    <div class="d-flex my-3 justify-content-between">
      <div class="d-flex align-items-center">
        <img src="@/assets/images/poker.png" class="me-3" style="width: 30px; height: 30px;">
        <div class="fw-bold title-app">REMI GAME</div>
      </div>
      <button type="button" class="btn btn-secondary custom-rounded fw-bold" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm" v-if="listPlayer.length"><i class="mdi mdi-plus me-2"></i>ADD NEW PLAYER</button>
    </div>
    <div class="my-3">&nbsp;</div>
    <div v-if="fetching" class="d-flex align-items-center justify-content-center h-75">
      <div class="d-block text-center">
        <img src="@/assets/images/ripples.svg" class="mb-3" style="width: 100px;">
        <div>LOADING ...</div>
      </div>
    </div>
    <template v-else>
      <div class="row" v-if="listPlayer.length">
        <div class="col-xl-3 mb-3" v-for="player, index in listPlayer">
          <div class="card custom-rounded border-0 bg-secondary player">
            <div class="card-header custom-rounded-card-header" :class="{'bg-danger': allPoint(player) < 0}">
              <div class="d-flex justify-content-between align-items-center py-2">
                <div class="fs-3 fw-bold m-0" :class="{'text-warning': getWinner.player?.id === player.id}">
                  <i class="mdi mdi-lightning-bolt" style="filter: drop-shadow(0px 4px 6px rgba(255, 193, 7, 1));" v-if="getWinner.player?.id === player.id"></i>
                  {{ player.name }}
                </div>
                <div class="fs-3 fw-bold m-0" :class="{'text-warning': getWinner.player?.id === player.id}" :style="{'color': allPoint(player) < 0 ? 'white' : 'white'}">{{ allPoint(player) }} <span class="fs-6">pts</span></div>
              </div>
            </div>
            <div class="card-body">
              <template v-if="player.points.length">
                <div class="d-flex custom-rounded bg-dark justify-content-between align-items-center border-dark py-1 mb-2" v-for="item in player.points">
                  <div class="d-flex p-0 align-items-center">
                    <button type="button" class="btn btn-link btn-small btn-circle ms-2 p-0 m-2" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmRemoveScore(item)"><i class="mdi mdi-trash-can text-secondary"></i></button>
                    <div class="border-start" style="border-color: #404040 !important;">&nbsp;</div>
                    <div class="fw-bold text-capitalize ms-3" style="font-size: 10pt">{{ item.type }}</div>
                  </div>
                  <div class="fs-4 fw-bold me-3" :style="{'color': item.type.toLowerCase() == '-' ? 'white' : item.type.toLowerCase() == 'plus' ? '#F3C623' : '#F05A7E'}">
                    <i class="mdi mdi-arrow-top-right" v-if="item.type.toLowerCase() == 'plus'"></i>
                    <i class="mdi mdi-arrow-bottom-left" v-if="item.type.toLowerCase() == 'minus'"></i>
                    {{ item.score }}</div>
                </div>
              </template>
              <div v-else class="text-dark py-3" style="font-size:14px">
                Belum ada score yang masuk saat ini
              </div>
            </div>
            <div class="card-footer">
              <div class="d-none d-flex justify-content-between py-2">
                <input type="number" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter point..." v-model="player.score" />
                <button type="button" class="btn btn-dark custom-rounded fw-bold ms-2" v-if="player.score" @click="saveScore(player.id, player.score)">ADD</button>
              </div>
              <div class="d-grid pt-2">
                <button type="button" class="btn btn-warning custom-rounded fw-bold show-hover mb-2" data-bs-toggle="modal" data-bs-target="#formScore" @click="openFormScore(player)">ADD SCORE</button>
                <button type="button" class="btn btn-secondary text-dark custom-rounded fw-bold show-hover" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmKickPlayer(player)">KICK PLAYER</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row h-75 align-items-center" v-else>
        <div class="col-md-12 text-center">
          <img src="@/assets/images/empty-inbox.png" style="width: 150px;" class="img-fluid mb-3">
          <div class="text-muted">Belum ada pemain untuk saat ini.</div>
          <div class="text-muted mb-4">Silahkan tentukan para pemain terlebih dahulu</div>

          <button class="btn btn-secondary p-3 custom-rounded" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm"><i class="mdi mdi-plus me-2"></i>ADD NEW PLAYER</button>
        </div>
      </div>
    </template>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="addMember" tabindex="-1" aria-labelledby="addMemberLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-rounded bg-dark">
        <div class="modal-header border-0">
          <h5 class="modal-title text-white" id="addMemberLabel">Tambah Pemain Baru</h5>
        </div>
        <div class="modal-body">
          <div class="form-group text-white mb-3">
            <label class="form-label mb-2">Nama Pemain</label>
            <input type="text" v-model="form.name" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter name of player..." />
          </div>
          <div class="form-group text-white">
            <label class="form-label mb-2">Poin</label>
            <input type="number" v-model="form.point" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter point of player (optional)..." />
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" ref="closeModal" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-secondary custom-rounded" @click="saveMember">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="formScore" tabindex="-1" aria-labelledby="formScoreLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-rounded bg-dark">
        <div class="modal-header border-0">
          <h5 class="modal-title text-white" id="formScoreLabel">Tambah Pemain Baru</h5>
        </div>
        <div class="modal-body">
          <div class="form-group row text-white mb-3">
            <div class="col-md-6">
              <label class="form-label mb-2">Nilai Min</label>
              <input type="text" v-model="formScore.min" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter minus score" />
            </div>
            <div class="col-md-6">
              <label class="form-label mb-2">Nilai Plus</label>
              <input type="text" v-model="formScore.plus" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter plus score" />
            </div>
          </div>
          <div class="form-group text-white mb-3">
            <label class="form-label mb-2">Total Nilai</label>
            <input type="text" v-model="formScore.total" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter total of score ..." />
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" ref="closeModalScore" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn custom-rounded" :class="{'btn-warning fw-bold': formScore.total, 'btn-secondary': !formScore.total}" :disabled="!formScore.total" @click="saveScore(detailPlayer.id, formScore.total)">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="confirm" tabindex="-1" aria-labelledby="confirmLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-rounded bg-dark">
        <div class="modal-header border-0">
          <h5 class="modal-title text-white" id="confirmLabel">{{ confirmMessage.title }}</h5>
        </div>
        <div class="modal-body">
          <div class="mb-2 text-white" v-html="confirmMessage.message"></div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" ref="closeModalConfirm" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-secondary custom-rounded" @click="actionConfirm(confirmMessage.action)">{{ confirmMessage.action_title }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { max, findIndex } from 'lodash';

import { db } from '@/utils/firebase';
import { doc, setDoc, getDocs, addDoc, collection, where, deleteDoc, query, orderBy } from "firebase/firestore";

export default {
  data() {
    return {
      listPlayer: [],
      form: {
        name: '',
        point: ''
      },
      detailPlayer: {},
      fetching: false,
      confirmMessage: {
        title: '',
        message: '',
        action: '',
        action_title: ''
      },
      formScore: {
        min: '',
        plus: '',
        total: ''
      },
      detailScore: null
    }
  },
  computed: {
    allPoint() {
      return (data) => {
        return this.calculatePoint(data)
      }
    },
    getWinner() {
      let result = null
      
      let tmpScore = []

      this.listPlayer.forEach(player => {
        tmpScore.push(this.calculatePoint(player))
      });

      let playerHighScore = null
      result = max(tmpScore)
      
      if (result > 0) {
        let findPlayerByHighScore = findIndex(tmpScore, (num) => num === result)
        playerHighScore = this.listPlayer[findPlayerByHighScore]
      }
      
      return {
        'score': result,
        'player': playerHighScore
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.fetching = true
        this.listPlayer = []
        let tmpAllPlayer = []

        // get data player
        const querySnapshot = await getDocs(collection(db, "player"), orderBy("name", "asc"));
        querySnapshot.forEach((doc) => {
          tmpAllPlayer.push({ id: doc.id, ...doc.data() });
        });

        let listScorePlayer = []
        // Ambil data score
        const scoreSnapshot = await getDocs(collection(db, "score"), where("createdAt", "==", new Date()));        
        listScorePlayer = scoreSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Gabungkan data berdasarkan userId
        this.listPlayer = tmpAllPlayer.map((player) => {
          const score = listScorePlayer
                      .map((dataScore) => ({
                        type: dataScore.score < 0 ? 'Minus' : dataScore.score > 0 ? 'Plus' : '-',
                        ...dataScore,
                        score: parseInt(dataScore.score.toString().replace('-', ''))
                      }))
                      .filter((score) => score.userId === player.id)
                      .sort((a, b) => a.createdAt - b.createdAt);
          return {
            ...player,
            points: score
          };
        });

        this.fetching = false
      } catch (error) {
        this.fetching = false
      }
    },
    calculatePoint(data) {
      let result = 0

      if (data.points?.length) {
        data.points.forEach(element => {
          if (element.type.toLowerCase() == 'plus')
            result += element.score
          else
            result -= element.score
        });
      }

      return result
    },
    async saveMember() {
      const process = await addDoc(collection(db, "player"), {
          name: this.form.name,
          point: this.form.point,
      });

      if (process.id) {
        this.$refs.closeModal.click()
        this.fetchData()
        this.$toast.success('Data saved successfully!');
      } else {
        this.$toast.error('Data saved failed!');
      }
    },
    resetForm() {
      this.form = {
        name: '',
        point: ''
      }
    },
    async kickPlayer(id) {
      const playerRef = doc(db, "player", id);
      await deleteDoc(playerRef);
      
      const buildQuery = query(collection(db, "score"),
        where("userId", "==", id),
      );

      const scoreSnapshot = await getDocs(buildQuery);

      const deletePromises = scoreSnapshot.docs.map((document) => deleteDoc(doc(db, "score", document.id)));
      await Promise.all(deletePromises);

      this.$refs.closeModalConfirm.click()
      this.fetchData()
    },
    async removeScore(id) {
      try {
        const scoreRef = doc(db, "score", id);
        await deleteDoc(scoreRef);

        this.$refs.closeModalConfirm.click()
        this.fetchData()
        this.$toast.success('Data deleted successfully!');
      } catch (error) {
        this.$toast.error('Data deleted failed!');
      }
    },
    async saveScore(userId, score, id=null) {
      let process = false
      if (id) {
        process = await setDoc(doc(db, "score", id), {
          userId: userId,
          score: score,
          createdAt: new Date()
        });
      } else {
        process = await addDoc(collection(db, "score"), {
          userId: userId,
          score: score,
          createdAt: new Date()
        });
      }

      if (process) {
        this.$refs.closeModalScore.click()
        this.fetchData()
        this.$toast.success('Data saved successfully!');
      } else {
        this.$toast.error('Data saved failed!');
      }
    },
    confirmKickPlayer(data) {
      this.confirmMessage = {
        title: 'Kick Pemain',
        message: `Apakah kamu yakin akan mengeluarkan pemain dengan Nama <span class="text-decoration-underline fw-bold fs-5">${data.name}</span> ?`,
        action: 'kick-player',
        action_title: 'Kick This Player'
      }
      this.detailPlayer = data
    },
    confirmRemoveScore(score) {
      this.confirmMessage = {
        title: 'Remove Score',
        message: `Apakah kamu yakin akan menghapus skor ini ?`,
        action: 'remove-score',
        action_title: 'Remove Score'
      }
      this.detailScore = score
    },
    actionConfirm(action) {
      switch (action) {
        case 'kick-player':
          this.kickPlayer(this.detailPlayer.id)
          break;
        case 'remove-score':
          this.removeScore(this.detailScore.id)
        default:
          break;
      }
    },
    calculcateScore() {
      let result = 0

      if (this.formScore.min >= 0) {
        result -= parseInt(this.formScore.min) || 0
      } if (this.formScore.plus >= 0) {
        result += parseInt(this.formScore.plus) || 0
      }

      this.formScore.total = result
    },
    openFormScore(data) {
      this.detailPlayer = data
      this.formScore = {
        min: '',
        plus: '',
        total: ''
      }
    }
  }
}
</script>