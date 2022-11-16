<template>
  <div class="w-screen h-screen flex flex-col py-5 items-center">
    <!-- Header -->
    <div
      class="p-6 flex items-center justify-between bg-slate-600 w-11/12 md:w-5/6 lg:w-3/5"
    >
      <div class="text-white">
        <p class="text-md">Hi User,</p>
      </div>
      <div>
        <button
          @click="adding = !adding"
          class="inline-block px-6 py-2.5 text-gray-700 bg-slate-100 font-medium text-sm leading-tight rounded shadow-md hover:bg-slate-300 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
        >
          {{ adding ? "Cancel" : "Add Unit" }}
        </button>
      </div>
    </div>
    <!-- Add Unit -->
    <Transition name="shutter">
      <div
        class="flex flex-col border-2 w-11/12 md:w-5/6 lg:w-3/5 p-6"
        v-if="adding"
      >
        <div class="flex justify-between pb-3">
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label for="polling_unit_number" class="text-sm pb-2 font-light"
              >Polling Unit Number</label
            >
            <input
              class="text-gray-600 border pl-1 py-1 border-slate-600 bg-transparent focus:bg-white focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
              type="text"
              name="polling_unit_number"
              v-model="new_unit.polling_unit_number"
              placeholder="DT17...."
            />
          </div>
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label
              for="polling_unit_name"
              class="text-sm pb-2 font-light text-left"
              >Polling Unit Name</label
            >
            <input
              class="text-gray-600 border pl-1 py-1 border-slate-600 bg-transparent focus:bg-white focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
              type="text"
              name="polling_unit_name"
              v-model="new_unit.polling_unit_name"
              placeholder="Agbasa...."
            />
          </div>
        </div>
        <div class="flex justify-between pb-3">
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label for="lga_id" class="text-sm pb-2 font-light"
              >Local Government Area</label
            >
            <select
              name="lga_id"
              v-model="new_unit.lga_id"
              class="appearance-none text-gray-600 border pl-1 py-1 focus:bg-white border-slate-600 bg-transparent focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
            >
              <option
                :value="item.lga_id"
                v-for="(item, index) in lgas"
                :key="index"
              >
                {{ item.lga_name }}
              </option>
            </select>
          </div>
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label for="ward_id" class="text-sm pb-2 font-light">Ward</label>
            <select
              name="ward_id"
              v-model="new_unit.ward_id"
              class="appearance-none text-gray-600 border pl-1 py-1 focus:bg-white border-slate-600 bg-transparent focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
            >
              <option
                :value="item.ward_id"
                v-for="(item, index) in wards"
                :key="index"
              >
                {{ item.ward_name }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-between pb-3">
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label for="lat" class="text-sm pb-2 font-light">Latitude</label>
            <input
              class="text-gray-600 border pl-1 py-1 border-slate-600 bg-transparent focus:bg-white focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
              type="text"
              name="lat"
              v-model="new_unit.lat"
              placeholder="5.5..."
            />
          </div>
          <div class="w-1/2 md:w-full px-2 flex flex-col">
            <label for="long" class="text-sm pb-2 font-light text-left"
              >Longitude</label
            >
            <input
              class="text-gray-600 border pl-1 py-1 border-slate-600 bg-transparent focus:bg-white focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
              type="text"
              name="long"
              v-model="new_unit.long"
              placeholder="6.1..."
            />
          </div>
        </div>
        <div class="grid grid-cols-3 grid-rows-2 justify-between pb-3 gap-y-3">
          <div
            class="w-1/2 md:w-full px-2 flex flex-col"
            :key="index"
            v-for="(item, index) in parties"
          >
            <label for="name" class="text-sm pb-2 font-light">{{
              item.partyid
            }}</label>
            <input
              class="text-gray-600 border pl-1 py-1 border-slate-600 bg-transparent focus:bg-white focus:border-slate-600 focus:outline-none focus:text-black transition ease-in-out"
              type="text"
              name="name"
              v-model="new_unit.parties[index].count"
              placeholder="100..."
            />
          </div>
        </div>
        <div class="flex items-center py-3 px-2">
          <button
            @click="addUnit"
            class="mx-auto inline-block px-6 md:px-16 xl:px-26 py-2.5 text-white bg-slate-900 font-medium text-sm leading-tight rounded hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out disabled:bg-slate-900 disabled:text-white"
          >
            Add Unit
          </button>
        </div>
      </div>
    </Transition>
    <!-- Get By -->
    <div
      class="flex justify-evenly border-2 w-11/12 md:w-5/6 lg:w-3/5 p-6"
      v-if="!loading_new"
    >
      <div
        class="p-6 flex flex-col gap-6 items-center justify-center"
        :class="loading ? 'border-b-0' : ''"
      >
        <p class="text-xl">Select A Polling Unit</p>
        <select class="py-3 pl-2 w-60" v-model="unit_id">
          <option
            v-for="(item, index) in units"
            :value="item.uniqueid"
            :key="index"
          >
            {{ item.polling_unit_number }} - {{ item.polling_unit_name.trim() }}
          </option>
        </select>
        <button
          class="inline-block px-6 py-2.5 text-white bg-slate-800 font-medium text-sm leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
          @click="getResult(0)"
        >
          Get Results
        </button>
      </div>
      <div class="flex items-center">OR</div>
      <div
        class="p-6 flex flex-col gap-6 items-center justify-center"
        :class="loading ? 'border-b-0' : ''"
      >
        <p class="text-xl">Select Government Area</p>
        <select class="py-3 pl-2 w-60" v-model="lga_id">
          <option
            v-for="(item, index) in lgas"
            :value="item.lga_id"
            :key="index"
          >
            {{ item.lga_id }} - {{ item.lga_name.trim() }}
          </option>
        </select>
        <button
          class="inline-block px-6 py-2.5 text-white bg-slate-800 font-medium text-sm leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
          @click="getResult(1)"
        >
          Get Results
        </button>
      </div>
    </div>
    <!-- Loading animation -->
    <div
      class="border-2 border-t-0 w-11/12 md:w-5/6 lg:w-3/5 py-3 px-2"
      v-show="loading || loading_new"
    >
      <div
        style="border-top-color: transparent; margin: auto"
        class="w-8 h-8 border-4 border-gray-800 border-dotted rounded-full animate-spin"
        role="status"
      ></div>
    </div>
    <!-- Results -->
    <Transition name="shutter">
      <div
        class="flex border-2 justify-evenly border-t-0 w-11/12 md:w-5/6 lg:w-3/5 py-3 px-2"
        v-if="!loading && searched && !loading_new"
      >
        <div class="flex flex-col gap-3 items-center">
          <p class="text-lg" v-if="unit_results.length > 0">
            Results For Polling Unit
          </p>
          <p v-if="!(unit_results.length > 0)">
            No result to show for this unit
          </p>
          <div
            class="grid grid-cols-2 gap-10 justify-items-center bg-slate-300 px-6 py-3"
            v-if="unit_results.length > 0"
          >
            <th>Party</th>
            <th>Score</th>
          </div>
          <div
            class="grid grid-cols-2 gap-10 justify-items-center"
            :key="index"
            v-for="(item, index) in unit_results"
          >
            <p>{{ item.party_abbreviation }}</p>
            <p>{{ item.party_score }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-3 items-center">
          <p class="text-lg" v-if="lga_results.length > 0">
            Results For Government Area
          </p>
          <p v-if="!(lga_results.length > 0)">
            No result to show for this government area
          </p>
          <div
            class="grid grid-cols-2 gap-10 justify-items-center bg-slate-300 px-6 py-3"
            v-if="lga_results.length > 0"
          >
            <th>Party</th>
            <th>Score</th>
          </div>
          <div
            class="grid grid-cols-2 gap-10 justify-items-center"
            :key="index"
            v-for="(item, index) in mergeResults"
          >
            <!--TODO: remember to fix this -->
            <p>{{ Object.keys(item)[0] }}</p>
            <p>{{ Object.values(item)[0] }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //api_url: "http://localhost:4000/",
      api_url: window.location.href,
      units: [],
      lgas: [],
      wards: [],
      parties: [],
      unit_id: "",
      lga_id: "",
      loading: false,
      loading_new: false,
      adding: false,
      unit_results: [],
      lga_results: [],
      searched: false,
      new_unit: {
        parties: [
          { name: "PDP", count: null },
          { name: "DPP", count: null },
          { name: "ACN", count: null },
          { name: "PPA", count: null },
          { name: "CDC", count: null },
          { name: "JP", count: null },
          { name: "ANPP", count: null },
          { name: "LABO", count: null },
          { name: "CPP", count: null },
        ],
      },
    };
  },
  computed: {
    mergeResults: function () {
      let data = {};
      this.lga_results.forEach((item) => {
        data[item.party_abbreviation] = data[item.party_abbreviation]
          ? data[item.party_abbreviation] + item.party_score
          : item.party_score;
      });
      const result = Object.entries(data).map(([key, value]) => ({
        [key]: value,
      }));
      return result;
    },
  },
  mounted() {
    this.loading = true;
    fetch(`${this.api_url}fetch`)
      .then((resp) => resp.json())
      .then((data) => {
        this.units = data.units;
        this.lgas = data.lgas;
        this.wards = data.wards;
        this.parties = data.parties;
        this.unit_id = this.units[0].uniqueid ?? "";
        this.lga_id = this.lgas[0].lga_id ?? "";
        this.loading = false;
      });
  },
  methods: {
    getResult(type) {
      this.searched = true;
      this.loading = true;
      if (type == 0) {
        fetch(`${this.api_url}units/${this.unit_id}`)
          .then((resp) => resp.json())
          .then((data) => {
            this.unit_results = data.results;
            this.loading = false;
          });
      } else if (type == 1) {
        fetch(`${this.api_url}lgas/${this.lga_id}`)
          .then((resp) => resp.json())
          .then((data) => {
            this.lga_results = data.results;
            this.loading = false;
          });
      }
    },
    addUnit() {
      this.loading_new = true;
      fetch(`${this.api_url}unit`, {
        method: "POST",
        body: JSON.stringify(this.new_unit),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(() => {
        this.loading_new = false;
        this.adding = false;
        this.new_unit = {
          parties: [
            { name: "PDP", count: null },
            { name: "DPP", count: null },
            { name: "ACN", count: null },
            { name: "PPA", count: null },
            { name: "CDC", count: null },
            { name: "JP", count: null },
            { name: "ANPP", count: null },
            { name: "LABO", count: null },
            { name: "CPP", count: null },
          ],
        };
        this.loading = true;
        fetch(`${this.api_url}fetch`)
          .then((resp) => resp.json())
          .then((data) => {
            this.units = data.units;
            this.lgas = data.lgas;
            this.wards = data.wards;
            this.parties = data.parties;
            this.unit_id = this.units[0].uniqueid ?? "";
            this.lga_id = this.lgas[0].lga_id ?? "";
            this.loading = false;
          });
      });
    },
  },
};
</script>
<style scoped>
.shutter-enter-active {
  animation: shutter-in-top 0.25s ease 0s 1 normal none;
}
.shutter-leave-active {
  animation: shutter-out-top 0.25s ease 0s 1 normal none;
}
@keyframes shutter-in-top {
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
}
@keyframes shutter-out-top {
  0% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
  100% {
    transform: rotateX(70deg);
    transform-origin: top;
    opacity: 0;
  }
}
</style>
