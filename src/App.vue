<template>
  <div class="container p-3 text-white vh-100">
    <div class="d-flex my-3 justify-content-between">
      <div class="d-flex align-items-center text-warning flex-shrink-0 me-3">
        <img src="@/assets/images/playing-cards.png" class="me-3" style="width: 50px; height: 50px;">
        <div class="fw-bold title-app">REMI GAME</div>
      </div>
      <div class="d-flex align-items-center">
        <button type="button" class="btn btn-warning custom-rounded fw-bold mobile-hide" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm" v-if="listPlayer.length"><i class="mdi mdi-plus me-2"></i>ADD NEW PLAYER</button>
        <div class="dropdown flex-shrink-1 mobile-hide">
          <button type="button" class="btn btn-outline-warning custom-rounded ms-2" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-vertical ml-1 p-0"></i></button>
          <ul class="dropdown-menu custom-rounded bg-secondary" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#gameRules">Game Rules</a></li>
            <div class="dropdown-divider"></div>
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmKickAllPlayer">Kick All Player</a></li>
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmRemoveAllScore">Reset All Score</a></li>
          </ul>
        </div>
        <div class="dropdown mobile-show">
          <button class="btn btn-warning custom-rounded d-flex align-items-center justify-content-center" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="mdi mdi-dots-vertical fs-2 ml-1 p-0"></i>
          </button>
          <ul class="dropdown-menu custom-rounded bg-secondary" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm" >Add New Player</a></li>
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#gameRules">Game Rules</a></li>
            <div class="dropdown-divider"></div>
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmKickAllPlayer">Kick All Player</a></li>
            <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmRemoveAllScore">Reset All Score</a></li>
          </ul>
        </div>
      </div>
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
        <div class="col-xl-3 col-md-6 mb-3" v-for="player, index in listPlayer" :key="index">
          <div :class="`card custom-rounded border-0 bg-secondary player ${getWinner.player?.id === player.id && 'win-effect'}`">
            <div class="card-header custom-rounded-card-header bg-secondary px-0 py-1" style="position: relative; height: 80px;" :class="{'bg-danger': allPoint(player) < 0, 'bg-warning': getWinner.player?.id === player.id}">
              <client-only v-if="getWinner.player?.id === player.id">
                <Vue3Lottie
                  style="position: absolute; z-index: 1; width: 100%"
                  class="wave"
                  animationLink="https://lottie.host/ce0a43f9-c262-4a25-be62-390cc1549ba5/2beXKHhOHm.json"
                />
              </client-only>  
              <div class="d-flex justify-content-between align-items-center py-2 px-3" style="z-index: 2; position: absolute; right: 0; left: 0">
                <i class="mdi mdi-crown flex-shrink-0 fs-2 fw-bold" style="filter: drop-shadow(0px 2px 4px rgba(255, 255, 255, 1));" v-if="getWinner.player?.id === player.id"></i>
                <input type="text" v-model="player.name" class="form-control no-hover me-2 fs-3 border-0 bg-transparent px-0 fw-bold text-white" @blur="updatePlayer(player)" />
                <div class="fs-3 fw-bold m-0 flex-shrink-0" :style="{'color': allPoint(player) < 0 ? 'white' : 'white'}">{{ allPoint(player) }} <span class="fs-6">pts</span></div>
                <div class="dropdown flex-shrink-1 ms-3 mobile-show">
                  <button type="button" class="btn btn-link p-0 custom-rounded text-white" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-vertical fs-3 p-0"></i></button>
                  <ul class="dropdown-menu custom-rounded bg-secondary shadow" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#formScore" @click="openFormScore(player)">Add Score</a></li>
                    <div class="dropdown-divider bg-secondary"></div>
                    <li v-if="player.points.length"><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmResetScore(player)">Reset Score</a></li>
                    <li><a class="dropdown-item text-white" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmKickPlayer(player)">Kick Player</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <template v-if="player.points.length">
                <template v-for="item, index in player.points">
                  <div class="d-flex custom-rounded justify-content-between align-items-center border-dark mb-2" :class="{'bg-dark py-2': index == 0, 'bg-dark-smooth': index > 0}" :key="item.id" v-if="index <= player.limit - 1">
                    <div class="d-flex p-0 align-items-center">
                      <button type="button" class="btn btn-link btn-small btn-circle ms-2 p-0 m-2" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmRemoveScore(item)"><i class="mdi mdi-trash-can text-secondary"></i></button>
                      <div class="border-start" style="border-color: #404040 !important;">&nbsp;</div>
                      <div class="fw-bold text-capitalize ms-3" style="font-size: 10pt" :style="{'color': index > 0 ? '#909090' : '#ffffff'}">{{ item.type }}</div>
                    </div>
                    <div class="fw-bold me-3" :class="{'fs-3': index == 0, 'fs-4': index > 0}" :style="{'color': item.type.toLowerCase() == '-' ? 'white' : item.type.toLowerCase() == 'plus' ? (index == 0 ? '#F3C623' : '#b19d53') : (index == 0 ? '#F05A7E' : '#c16b7f')}">
                      <i class="mdi mdi-arrow-top-right" v-if="item.type.toLowerCase() == 'plus'"></i>
                      <i class="mdi mdi-arrow-bottom-left" v-if="item.type.toLowerCase() == 'minus'"></i>
                      {{ item.score }}</div>
                  </div>
                </template>
                <div class="d-flex justify-content-center mt-3" v-if="player.points.length > (isMobile ? 2 : 6)">
                  <button class="btn btn-secondary text-dark custom-rounded fw-bold" @click="player.limit = isMobile ? 2 : 6" v-if="player.limit == player.points.length">Minimize</button>
                  <button class="btn btn-secondary text-dark custom-rounded fw-bold" @click="player.limit = player.points.length" v-else>See More</button>
                </div>
              </template>
              <div v-else class="text-dark py-3" style="font-size:14px">
                Belum ada score yang masuk saat ini
              </div>
            </div>
            <div class="card-footer show-hover">
              <div class="mobile-hide">
                <div class="d-none d-flex justify-content-between py-2">
                  <input type="number" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter point..." v-model="player.score" />
                  <button type="button" class="btn btn-dark custom-rounded fw-bold ms-2" v-if="player.score" @click="saveScore(player.id, player.score)">ADD</button>
                </div>
                <div class="d-grid pt-2 mb-2">
                  <button type="button" class="btn btn-warning custom-rounded fw-bold show-hover" data-bs-toggle="modal" data-bs-target="#formScore" @click="openFormScore(player)">ADD SCORE</button>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <button v-if="player.points.length" type="button" class="btn btn-secondary text-dark custom-rounded fw-bold show-hover" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmResetScore(player)">RESET SCORE</button>
                  <button type="button" class="btn btn-secondary text-dark custom-rounded fw-bold show-hover" :class="{'w-100': !player.points.length}" data-bs-toggle="modal" data-bs-target="#confirm" @click="confirmKickPlayer(player)">KICK PLAYER</button>
                </div>
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

          <button class="btn btn-warning px-3 custom-rounded fw-bold" data-bs-toggle="modal" data-bs-target="#addMember" @click="resetForm"><i class="mdi mdi-plus me-2"></i>ADD NEW PLAYER</button>
        </div>
      </div>
    </template>
  </div>

  <div class="modal fade" id="addMember" tabindex="-1" aria-labelledby="addMemberLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-rounded bg-dark">
        <div class="modal-header border-0">
          <h5 class="modal-title text-white" id="addMemberLabel">Tambah Pemain Baru</h5>
        </div>
        <div class="modal-body">
          <div class="form-group text-white mb-3">
            <label class="form-label mb-2">Nama Pemain</label>
            <input type="text" v-model="form.name" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter name of player..." @keydown.enter="saveMember" />
          </div>
          <div class="d-none form-group text-white">
            <label class="form-label mb-2">Poin</label>
            <input type="number" v-model="form.point" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter point of player (optional)..." />
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" :disabled="fetching" ref="closeModal" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Close</button>
          <button type="button" :disabled="fetching" class="btn custom-rounded" :class="{'btn-secondary': !form.name, 'btn-warning fw-bold': form.name}" @click="saveMember">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="modal fade" id="formScore" tabindex="-1" aria-labelledby="formScoreLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content custom-rounded bg-dark">
        <div class="modal-header border-0">
          <div class="d-block">
            <h6 class="text-white" id="formScoreLabel">Tambah Skor</h6>
            <h5 class="modal-title text-white mb-2">{{ detailPlayer.name }}</h5>
          </div>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3 mobile-hide">
            <div class="row">
              <div class="col-md-6">
                 <div class="d-block bg-secondary p-3 custom-rounded">
                    <div class="d-flex justify-content-between mb-3">
                      <label class="form-label text-white mb-3 fw-bold">Nilai Minus</label>
                      <button type="button" class="btn btn-sm btn-dark custom-rounded py-0" @click="resetTempScore('min')" style="font-size: 10pt">Reset</button>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <img src="@/assets/images/diamond-ace-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.min.ace" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('min', 'ace', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('min', 'ace', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/diamond-king-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.min.king" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('min', 'king', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('min', 'king', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/diamond-number-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.min.number" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('min', 'number', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('min', 'number', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/diamond-joker-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.min.joker" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('min', 'joker', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('min', 'joker', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
              <div class="col-md-6">
                 <div class="d-block bg-secondary p-3 custom-rounded">
                    <div class="d-flex justify-content-between mb-3">
                      <label class="form-label text-white mb-3 fw-bold">Nilai Plus</label>
                      <button type="button" class="btn btn-sm btn-dark custom-rounded py-0" @click="resetTempScore('plus')" style="font-size: 10pt">Reset</button>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <img src="@/assets/images/ace-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.plus.ace" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('plus', 'ace', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('plus', 'ace', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/king-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.plus.king" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('plus', 'king', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('plus', 'king', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/number-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.plus.number" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('plus', 'number', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('plus', 'number', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <img src="@/assets/images/joker-card.png" class="mb-3" style="width: 100%;">
                        <input type="number" v-model="formScore.plus.joker" @input="calculcateScore" class="form-control custom-rounded bg-dark border-secondary text-white mb-1 text-center" style="font-size: 11pt" placeholder="Score" />
                        <div class="d-flex justify-content-between">
                          <button @click="actionScore('plus', 'joker', 'min')" class="btn btn-sm btn-dark custom-rounded p-0 flex-grow-1 py-1 me-2 border border-secondary"><i class="mdi mdi-minus fw-bold"></i></button>
                          <button @click="actionScore('plus', 'joker', 'add')" class="btn btn-sm btn-warning custom-rounded p-0 flex-grow-1 py-1"><i class="mdi mdi-plus fw-bold"></i></button>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          <div class="form-group text-white mb-3">
            <label class="form-label mb-2">Total Nilai</label>
            <input type="number" v-model="formScore.total" class="form-control custom-rounded bg-dark border-secondary text-white fs-6" placeholder="Enter total of score ..." @keydown.enter="saveScore(detailPlayer.id, formScore.total)" />
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" :disabled="fetching" ref="closeModalScore" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn custom-rounded btn-secondary" :class="{'btn-warning fw-bold': isNumber(formScore.total), 'btn-secondary': !isNumber(formScore.total)}" :disabled="!isNumber(formScore.total) || fetching" @click="saveScore(detailPlayer.id, formScore.total)">Save changes</button>
        </div>
      </div>
    </div>
  </div>

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
          <button type="button" ref="closeModalConfirm" :disabled="fetching" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-secondary custom-rounded" :disabled="fetching" @click="actionConfirm(confirmMessage.action)">{{ confirmMessage.action_title }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for game rules -->
  <div class="modal fade" id="gameRules" tabindex="-1" aria-labelledby="gameRulesLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content bg-dark">
        <div class="modal-header border-0">
          <div class="row w-100">
            <div class="col-md-6 m-auto">
              <h5 class="modal-title text-white" id="gameRulesLabel">PERATURAN PERMAINAN</h5>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="row w-100">
            <div class="col-md-6 m-auto">
              <div class="form-group text-white mb-3" style="line-height: 35px; text-align: justify">
                <ol>
                  <li class="mb-3 text-warning fw-bold">
                    <span>Objektif</span>
                    <p class="text-white fw-normal">Dapatkan poin tertinggi pada setiap permainan</p>
                  </li>
                  <li class="mb-3 text-warning fw-bold">
                    <span>Ketentuan Permainan</span>
                    <ol type="a" class="text-white fw-normal">
                      <li>Terdiri dari 4 pemain</li>
                      <li>Setiap pemain akan dibagikan 7 kartu</li>
                      <li>Kartu yang dimainkan adalah kartu angka (2 - 10), kerajaan (jack, queen, king), dan ace. Setiap kartu memiliki poin, diantaranya:</li>
                      <ol type="i">
                        <li>Kartu angka bernilai 5 poin</li>
                        <li>Kartu kerajaan bernilai 10 poin</li>
                        <li>Kartu ace bernilai 15 poin</li>
                      </ol>
                      <li>Dalam setiap permainan, terdapat 1 kartu joker (diambil secara acak dari tumpukan kartu sisa). Kartu joker adalah kartu pamungkas yang memiliki poin fleksibel, diantaranya:</li>
                      <ol type="i">
                        <li>Jika dipasangkan dengan kartu 8 dan 9 wajik, maka bisa berperan sebagai kartu angka 10 atau 7 wajik dan bernilai 5 poin</li>
                        <li>Jika dipasangkan dengan kartu jack dan king hati, maka bisa berperan sebagai kartu queen dan bernilai 10 poin</li>
                        <li>Jika dipasangkan dengan kartu ace wajik dan ace hati, maka bisa berperan sebagai kartu ace keriting dan atau ace sekop dan bernilai 15 poin</li>
                      </ol>
                      <li>Untuk mendapatkan poin awal, setiap pemain harus memiliki kartu seri. Kartu seri adalah 3 atau lebih kartu berurutan dengan simbol yang sama, kecuali ace. Contoh:</li>
                      <ol type="i">
                        <li>Kartu 8, 9, 10 wajik</li>
                        <li>Kartu jack, queen, king hati</li>
                        <li>Kartu ace wajik, ace hati, ace keriting</li>
                      </ol>
                      <li>Jika sampai akhir putaran pemain tidak bisa mendapatkan kartu seri, maka akan mendapatkan nilai minus sesuai poin kartu</li>
                      <li>Jika sampai akhir putaran pemain tidak bisa mendapatkan kartu seri dan memiliki kartu joker, maka akan mendapatkan nilai minus sesuai poin kartu ditambah minus kartu joker, diantaranya</li>
                      <ol type="i">
                        <li>Joker angka bernilai -50</li>
                        <li>Joker kerajaan bernilai -100</li>
                        <li>Joker ace bernilai -150</li>
                      </ol>
                    </ol>
                  </li>
                  <li class="mb-3 text-warning fw-bold">
                    <span>Tata Cara Bermain</span>
                    <p class="text-white fw-normal">
                      Segera ...
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" :disabled="fetching" class="btn btn-link text-white text-decoration-none custom-rounded" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { max, findIndex, map } from 'lodash';

import { db } from '@/utils/firebase';
import { doc, setDoc, getDocs, addDoc, collection, where, deleteDoc, query, orderBy } from "firebase/firestore";

export default {
  data() {
    return {
      isMobile: false,
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
        min: {
          ace: 0,
          king: 0,
          number: 0,
          joker: 0
        },
        plus: {
          ace: 0,
          king: 0,
          number: 0,
          joker: 0
        },
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
    },
    isNumber() {
      return (value) => {
        return typeof value === 'number' && !isNaN(value);
      }
    }
  },
  mounted() {
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;

    this.fetchData(true)
    setInterval(() => {
      this.fetchData()
    }, 1000);
  },
  methods: {
    async fetchData(reload=false) {
      try {
        this.fetching = reload

        if (reload) {
          this.listPlayer = []
        }

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
                      .sort((a, b) => b.createdAt - a.createdAt);
          return {
            ...player,
            points: score,
            limit: this.isMobile ? 2 : 6
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
      this.fetching = true
      const process = await addDoc(collection(db, "player"), {
          name: this.form.name,
          point: this.form.point,
      });

      this.fetching = false
      if (process.id) {
        setTimeout(() => {
          this.$refs.closeModal.click()
          this.fetchData()
        }, 100);
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
      this.fetching = true
      const playerRef = doc(db, "player", id);
      await deleteDoc(playerRef);
      
      const buildQuery = query(collection(db, "score"),
        where("userId", "==", id),
      );

      const scoreSnapshot = await getDocs(buildQuery);

      const deletePromises = scoreSnapshot.docs.map((document) => deleteDoc(doc(db, "score", document.id)));
      await Promise.all(deletePromises);

      this.fetching = false
      setTimeout(() => {
        this.$refs.closeModalConfirm.click()
        this.fetchData()
      }, 100);
    },
    async kickAllPlayer() {
      if (this.listPlayer.length) {
        this.fetching = true

        const playerSnapshot = await getDocs(collection(db, "player"));
        const deletePromises = playerSnapshot.docs.map((document) => deleteDoc(doc(db, "player", document.id)));
        await Promise.all(deletePromises);

        this.resetAllScore()

        this.fetching = false
        setTimeout(() => {
          this.$refs.closeModalConfirm.click()
          this.fetchData()
        }, 100);
      } else {
        alert('Not a current player!')
      }
    },
    async removeScore(id) {
      this.fetching = true
      try {
        const scoreRef = doc(db, "score", id);
        await deleteDoc(scoreRef);

        this.fetching = false
        setTimeout(() => {
          this.$refs.closeModalConfirm.click()
          this.fetchData()
        }, 100);
        this.$toast.success('Data deleted successfully!');
      } catch (error) {
        this.fetching = false
        this.$toast.error('Data deleted failed!');
      }
    },
    async resetScore(id) {
      this.fetching = true
      const buildQuery = query(collection(db, "score"),
        where("userId", "==", id),
      );

      const scoreSnapshot = await getDocs(buildQuery);
      const deletePromises = scoreSnapshot.docs.map((document) => deleteDoc(doc(db, "score", document.id)));
      await Promise.all(deletePromises);

      this.fetching = false
      setTimeout(() => {
        this.$refs.closeModalConfirm.click()
        this.fetchData()
      }, 100);
    },
    async resetAllScore() {
      if (this.listPlayer.length) {
        this.fetching = true
        
        const buildQuery = query(collection(db, "score"),
          where("userId", "in", map(this.listPlayer, 'id')),
        );

        const scoreSnapshot = await getDocs(buildQuery);
        const deletePromises = scoreSnapshot.docs.map((document) => deleteDoc(doc(db, "score", document.id)));
        await Promise.all(deletePromises);

        this.fetching = false
        setTimeout(() => {
          this.$refs.closeModalConfirm.click()
          this.fetchData()
        }, 100);
      } else {
        alert('Not a current player!')
      }
    },
    async saveScore(userId, score, id=null) {
      this.fetching = true
      let process   = false
      const date    = new Date()

      if (id) {
        process = await setDoc(doc(db, "score", id), {
          userId: userId,
          score: score,
          createdAt: date
        });
      } else {
        process = await addDoc(collection(db, "score"), {
          userId: userId,
          score: score,
          createdAt: date
        });
      }

      this.fetching = false
      if (process) {
        const allScoresSnapshot = await getDocs(collection(db, "score"));
        const scores = allScoresSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        let oldScoreUser = 0;
        const totalScoresByUser = scores.reduce((acc, curr) => {
          const createdAtDate = curr.createdAt.toDate();
          
          if (!acc[curr.userId]) {
            acc[curr.userId] = 0;
          }
          acc[curr.userId] += curr.score;
          if(createdAtDate < date && curr.userId == userId){
            oldScoreUser += curr.score;
          }
          return acc;
        }, {});


        console.log(oldScoreUser);

        const highestOpponentScore = Object.values(totalScoresByUser).filter(
          (score) => score > 100 && score < totalScoresByUser[userId] && score !== totalScoresByUser[userId] && score > oldScoreUser
        );

        highestOpponentScore.forEach(async (item) => {
          if (item) {
            if (totalScoresByUser[userId] > item) {
              const highestOpponentDoc = scores.find((s) => totalScoresByUser[s.userId] === item);
              if (highestOpponentDoc) {
                await addDoc(collection(db, "score"), {
                  userId: highestOpponentDoc.userId,
                  score: -item, 
                  createdAt: new Date()
                });
              }
            }
          }
        });

        setTimeout(() => {
          this.$refs.closeModalScore.click()
          this.fetchData()
        }, 100);
        this.$toast.success('Data saved successfully!');
      } else {
        this.$toast.error('Data saved failed!');
      }
    },
    confirmKickPlayer(data) {
      this.confirmMessage = {
        title: 'Kick Player',
        message: `Apakah kamu yakin akan mengeluarkan pemain dengan Nama <span class="text-decoration-underline fw-bold fs-5">${data.name}</span> ?`,
        action: 'kick-player',
        action_title: 'Kick This Player'
      }
      this.detailPlayer = data
    },
    confirmKickAllPlayer(data) {
      this.confirmMessage = {
        title: 'Kick All Player',
        message: `Apakah kamu yakin akan mengeluarkan semua pemain ? <br/> Aksi ini termasuk mereset semua skor pada pemain`,
        action: 'kick-all-player',
        action_title: 'Kick All Player'
      }
      this.detailPlayer = data
    },
    confirmResetScore(data) {
      this.confirmMessage = {
        title: 'Reset Semua Score',
        message: `Apakah kamu yakin akan mereset score pemain dengan Nama <span class="text-decoration-underline fw-bold fs-5">${data.name}</span> ?`,
        action: 'reset-score',
        action_title: 'Reset Score This Player'
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
    confirmRemoveAllScore() {
      this.confirmMessage = {
        title: 'Reset All Score',
        message: `Apakah kamu yakin akan menghapus semua skor pada permainan ?`,
        action: 'reset-all-score',
        action_title: 'Reset All Score'
      }
    },
    actionConfirm(action) {
      switch (action) {
        case 'kick-player':
          this.kickPlayer(this.detailPlayer.id)
          break;
        case 'kick-all-player':
          this.kickAllPlayer(this.detailPlayer.id)
          break;
        case 'remove-score':
          this.removeScore(this.detailScore.id)
          break;
        case 'reset-score':
          this.resetScore(this.detailPlayer.id)
          break;
        case 'reset-all-score':
          this.resetAllScore()
          break;
        default:
          break;
      }
    },
    calculcateScore() {
      let result = 0

      if (this.formScore.min.ace >= 0) {
        result -= parseInt(this.formScore.min.ace * 15) || 0
      } if (this.formScore.min.king >= 0) {
        result -= parseInt(this.formScore.min.king * 10) || 0
      } if (this.formScore.min.number >= 0) {
        result -= parseInt(this.formScore.min.number * 5) || 0
      } if (this.formScore.min.joker >= 0) {
        result -= parseInt(this.formScore.min.joker) || 0
      } if (this.formScore.plus.ace >= 0) {
        result += parseInt(this.formScore.plus.ace * 15) || 0
      } if (this.formScore.plus.king >= 0) {
        result += parseInt(this.formScore.plus.king * 10) || 0
      } if (this.formScore.plus.number >= 0) {
        result += parseInt(this.formScore.plus.number * 5) || 0
      } if (this.formScore.plus.joker >= 0) {
        result += parseInt(this.formScore.plus.joker) || 0
      }

      this.formScore.total = result
    },
    openFormScore(data) {
      this.detailPlayer = data
      this.formScore = {
        min: {
          ace: 0,
          king: 0,
          number: 0,
          joker: 0
        },
        plus: {
          ace: 0,
          king: 0,
          number: 0,
          joker: 0
        },
      }
    },
    async updatePlayer(data) {
      this.fetching = true

      try {
        await setDoc(doc(db, "player", data.id), {
          name: data.name
        });
  
        this.fetching = false
        this.$toast.success('Data saved successfully!');
      } catch (error) {
        this.$toast.error('Data saved failed! ' . error.message);
      }
    },
    actionScore(scoreType, typeCard, action) {
      switch(typeCard) {
        case 'ace':
            if(action == 'add')
              this.formScore[scoreType].ace = (parseInt(this.formScore[scoreType].ace) || 0) + 1
            else
              this.formScore[scoreType].ace -= (this.formScore[scoreType].ace > 0 ? 1 : 0)
          break;
        case 'king':
            if(action == 'add')
              this.formScore[scoreType].king = (parseInt(this.formScore[scoreType].king) || 0) + 1
            else
              this.formScore[scoreType].king -= (this.formScore[scoreType].king > 0 ? 1 : 0)
          break;
        case 'number':
            if(action == 'add')
              this.formScore[scoreType].number = (parseInt(this.formScore[scoreType].number) || 0) + 1 
            else
              this.formScore[scoreType].number -= (this.formScore[scoreType].number > 0 ? 1 : 0)
          break;
        case 'joker':
            if(action == 'add')
              this.formScore[scoreType].joker = (parseInt(this.formScore[scoreType].joker) || 0) + 1
            else
              this.formScore[scoreType].joker -= (this.formScore[scoreType].joker > 0 ? 1 : 0)
          break;
      }
      this.calculcateScore()
    },
    resetTempScore(type) {
      this.formScore[type] = {
        ace: 0,
        king: 0,
        number: 0,
        joker: 0
      },
      this.calculcateScore()
    }
  }
}
</script>