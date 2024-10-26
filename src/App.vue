<template>
  <div class="container p-3 text-white vh-100">
    <div class="d-flex my-3 justify-content-between">
      <div class="d-flex align-items-center">
        <img src="@/assets/images/poker.png" class="me-3" style="width: 30px; height: 30px;">
        <div class="fw-bold title-app">REMI GAME</div>
      </div>
      <button type="button" class="btn btn-secondary custom-rounded" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm" v-if="listPlayer.length"><i class="mdi mdi-plus me-2"></i>ADD NEW PLAYER</button>
    </div>
    <div class="my-3">&nbsp;</div>
    <div class="row" v-if="listPlayer.length">
      <div class="col-xl-3 mb-3" v-for="player, index in listPlayer">
        <div class="card custom-rounded border-0 bg-secondary">
          <div class="card-header custom-rounded-card-header border-bottom-0">
            <div class="d-flex justify-content-between align-items-center py-2">
              <div class="fs-3 fw-bold m-0" :class="{'text-warning': getWinner.player.id === player.id}">
                <i class="mdi mdi-lightning-bolt" style="filter: drop-shadow(0px 4px 6px rgba(255, 193, 7, 1));" v-if="getWinner.player.id === player.id"></i>
                {{ player.name }}
              </div>
              <div class="fs-3 fw-bold m-0" :class="{'text-warning': getWinner.player.id === player.id}">{{ allPoint(player) }} <span class="fs-6">pts</span></div>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center border-dark py-2" v-for="item in player.points">
              <div class="text-dark fw-bold text-capitalize">{{ item.type }}</div>
              <div class="d-flex align-items-center custom-rounded bg-dark py-2 px-3">
                <div class="fs-5 fw-bold">{{ item.point }}</div>
                <div class="border-start border-secondary ms-3">&nbsp;</div>
                <button type="button" class="btn btn-link btn-small btn-circle ms-2 p-0 m-0"><i class="mdi mdi-trash-can text-secondary"></i></button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between py-2">
              <input type="number" class="form-control me-2 custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter point..." />
              <button type="button" class="btn btn-dark custom-rounded fw-bold">SAVE</button>
            </div>
            <button type="button" class="btn btn-secondary w-100 border border-dark text-dark custom-rounded fw-bold" @click="kickPlayer(index)">KICK PLAYER</button>
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
</template>
<script>
import { max, findIndex } from 'lodash';

export default {
  data() {
    return {
      listPlayer: [],
      form: {
        name: '',
        point: ''
      }
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

      result = max(tmpScore)
      let findPlayerByHighScore = findIndex(tmpScore, (num) => num === result)
      let playerHighScore = this.listPlayer[findPlayerByHighScore]
      
      
      return {
        'score': result,
        'player': playerHighScore
      }
    }
  },
  mounted() {
    this.listPlayer = [
        {
          id: 1,
          name: 'CAU',
          points: [
            {
              type: 'plus',
              point: 50,
            },
            {
              type: 'plus',
              point: 55,
            },
            {
              type: 'plus',
              point: 160,
            },
            {
              type: 'plus',
              point: 80,
            },
            {
              type: 'plus',
              point: 77,
            },
            {
              type: 'plus',
              point: 90,
            }
          ]
        },
        {
          id: 2,
          name: 'AZIZ',
          points: [
            {
              type: 'plus',
              point: 88,
            },
            {
              type: 'plus',
              point: 33,
            },
            {
              type: 'min',
              point: 88,
            },
            {
              type: 'min',
              point: 80,
            },
            {
              type: 'plus',
              point: 77,
            },
            {
              type: 'plus',
              point: 160,
            }
          ]
        },
        {
          id: 3,
          name: 'DONI',
          points: [
            {
              type: 'plus',
              point: 150,
            },
            {
              type: 'plus',
              point: 66,
            },
            {
              type: 'min',
              point: 22,
            },
            {
              type: 'min',
              point: 80,
            },
            {
              type: 'plus',
              point: 200,
            },
            {
              type: 'plus',
              point: 250,
            }
          ]
        },
        {
          id: 4,
          name: 'YUSRON',
          points: [
            {
              type: 'plus',
              point: 55,
            },
            {
              type: 'plus',
              point: 33,
            },
            {
              type: 'min',
              point: 22,
            },
            {
              type: 'min',
              point: 80,
            },
            {
              type: 'plus',
              point: 150,
            },
            {
              type: 'plus',
              point: 100,
            }
          ]
        }
      ]
  },
  methods: {
    calculatePoint(data) {
      let result = 0
      data.points.forEach(element => {
        if (element.type == 'plus')
          result += element.point
        else
          result -= element.point
      });

      return result
    },
    saveMember() {
      this.listPlayer.push(
        {
          id: this.listPlayer.length + 1,
          name: this.form.name,
          points: [
            {
              type: 'plus',
              point: 50,
            },
            {
              type: 'plus',
              point: 55,
            },
            {
              type: 'plus',
              point: 160,
            },
            {
              type: 'plus',
              point: 80,
            },
            {
              type: 'plus',
              point: 77,
            },
            {
              type: 'plus',
              point: 90,
            }
          ]
        }
      )
      this.$refs.closeModal.click()
      this.$toast.success('Data saved successfully!');
    },
    resetForm() {
      this.form = {
        name: '',
        point: ''
      }
    },
    kickPlayer(index) {
      this.listPlayer.splice(index, 1)
    },
    removeScore() {
    },
    addScore() {
    }
  }
}
</script>