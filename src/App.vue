<script setup lang="ts">
  import { onMounted, onUnmounted, ref, Ref } from 'vue';

  import background1 from './assets/png/background/background-1.png';
  import background2 from './assets/png/background/background-2.png';
  import background3 from './assets/png/background/background-3.png';
  import background4 from './assets/png/background/background-4.png';
  import background5 from './assets/png/background/background-5.png';
  import background6 from './assets/png/background/background-6.png';

  import featured1 from './assets/png/featured/featured-1.png';
  import featured2 from './assets/png/featured/featured-2.png';
  import featured3 from './assets/png/featured/featured-3.png';
  import featured4 from './assets/png/featured/featured-4.png';
  import featured5 from './assets/png/featured/featured-5.png';
  import featured6 from './assets/png/featured/featured-6.png';
  import featured7 from './assets/png/featured/featured-7.png';

  import cloudFontSource from './assets/font/Cloud.otf';

  import upIcon from './assets/png/icons/up.png';
  import downIcon from './assets/png/icons/down.png';

  // --------------------------------------------------------------------------
  // Cloud font load
  // --------------------------------------------------------------------------
  const cloudFont = new FontFace('Cloud', cloudFontSource);
  cloudFont.load().then(loadedFont => {
      document.fonts.add(loadedFont);
  });

  // --------------------------------------------------------------------------
  // Reference lists
  // --------------------------------------------------------------------------
  const BackgroundList: string[] = [
    background1, background2, background3, background4, background5, background6
  ];

  const FeaturedList: string[] = [
    featured1, featured2, featured3, featured4, featured5, featured6, featured7
  ];

  // --------------------------------------------------------------------------
  // Load images
  // --------------------------------------------------------------------------
  const BackgroundImages: HTMLImageElement[] = [];
  BackgroundList.forEach((element, n)=> {
    BackgroundImages[n] = new Image();
    BackgroundImages[n].src = element;
  })

  const FeaturedImages: HTMLImageElement[] = [];
  FeaturedList.forEach((element, n)=> {
    FeaturedImages[n] = new Image();
    FeaturedImages[n].src = element;
  })

  // --------------------------------------------------------------------------
  // Plate interface, list and selection
  // --------------------------------------------------------------------------
  interface Plate {
    name: string,
    price: number
  }

  const PlateList: Plate[] = [
    {
      name: "Salpicón",
      price: 144
    },

    {
      name: "Bistec",
      price: 144
    },

    {
      name: "Sopa de Res",
      price: 144
    },

    {
      name: "Sopa de Pollo",
      price: 144
    },

    {
      name: "Sopa de Caracol",
      price: 213
    },

    {
      name: "Pollo a la Crema",
      price: 144
    },

    {
      name: "Pollo Cabrón",
      price: 144
    },

    {
      name: "Tapado",
      price: 165
    },

    {
      name: "Costillita BBQ",
      price: 155
    },

    {
      name: "Costillita Ahumada",
      price: 155
    },

    {
      name: "Sopa de Fríjoles",
      price: 144
    },

    {
      name: "Sopa de Capirotadas",
      price: 144
    },

    {
      name: "Lengua de Res en Coco",
      price: 144
    },

    {
      name: "Sopa de Albóndigas",
      price: 144
    },

    {
      name: "Fajitas de Cerdo",
      price: 144
    },

    {
      name: "Chuleta Ktracha",
      price: 144
    },

    {
      name: "Pollo Chuco",
      price: 144
    },
  ];

  // --------------------------------------------------------------------------
  // Ref selections
  // --------------------------------------------------------------------------
  const SelectedPlate: Ref[] = [
    ref(0), ref(1), ref(2), ref(3), ref(4), ref(-2), ref(-2), ref(-2), ref(-2)
  ];
  const SelectedBackground = ref(0);
  const SelectedFeatured = ref(0);

  // --------------------------------------------------------------------------
  // Customized plates
  // --------------------------------------------------------------------------
  const CustomizedPlate: Ref<Plate>[] = [];
  SelectedPlate.forEach(() => {
    CustomizedPlate.push(ref<Plate>({
      name: "",
      price: 100
    }));
  });

  // --------------------------------------------------------------------------
  // Save data
  // --------------------------------------------------------------------------
  const SaveData = () => {
    const plateInformation: number[] = [];
    SelectedPlate.forEach((plateRef, n) => {
      plateInformation[n] = plateRef.value
    })

    const customInformation: Record<number, Plate>= {};
    SelectedPlate.forEach((plateRef, n) => {
      if (plateRef.value == -1) {
        const customRef = CustomizedPlate[n];
        customInformation[n] = {name: customRef.value.name, price: customRef.value.price}
      }
    })

    const dataString = JSON.stringify({
      generalBackground: SelectedBackground.value,
      generalFeatured: SelectedFeatured.value,
      plateInformation: plateInformation,
      customInformation: customInformation
    });
    localStorage.setItem("menuData", dataString);
  };

  // --------------------------------------------------------------------------
  // Load canvas
  // --------------------------------------------------------------------------
  const LoadData = () => {
    const dataString = localStorage.getItem("menuData");
    if (!dataString)
      return

    const dataObject = JSON.parse(dataString)
    if (!dataObject)
      return

    SelectedBackground.value = dataObject.generalBackground || 1;
    SelectedFeatured.value = dataObject.generalFeatured || 1;

    const plateInformation = dataObject.plateInformation;
    if (plateInformation)
      SelectedPlate.forEach((plateRef, n) => {
        plateRef.value = plateInformation[n];
      })

    const customInformation = dataObject.customInformation;
    if (customInformation)
      SelectedPlate.forEach((_, n) => {
        if (customInformation[n]) {
          const customRef = CustomizedPlate[n];
          customRef.value.name = customInformation[n].name || '';
          customRef.value.price = customInformation[n].price || 100;
        }
      })
  }


  // --------------------------------------------------------------------------
  // Redraw canvas
  // --------------------------------------------------------------------------
  const redrawCanvas = function() {
    const canvas = document.getElementById("menuCanvas") as HTMLCanvasElement | null;
    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        const img = BackgroundImages[SelectedBackground.value];
        if (img.complete) {
          context.drawImage(img, 0, 0);
        }
        else
          img.onload = () => {
          context.drawImage(img, 0, 0);
          }

        const featuredImg = FeaturedImages[SelectedFeatured.value];
        if (featuredImg.complete) {
          context.drawImage(featuredImg, 1080 - featuredImg.width, 0);
        }
        else
          featuredImg.onload = () => {
          context.drawImage(featuredImg, 1080 - featuredImg.width, 0);
          }

        let stepCount = 0;
        SelectedPlate.forEach((plateRef, n) => {
          context.font = '65px Cloud';
          context.fillStyle = 'white';

          if (plateRef.value >= 0)
            if (PlateList[plateRef.value] && PlateList[plateRef.value].name && typeof(PlateList[plateRef.value].name) == 'string') {
              context.fillText(PlateList[plateRef.value].name + "\n—" + PlateList[plateRef.value].price, 100, 1000 + 85 * stepCount);
              stepCount++;
            }

          if (plateRef.value == -1 ) {
            const customPlate = CustomizedPlate[n].value;
            context.fillText(customPlate.name.trim() + "\n— " + customPlate.price, 100, 1000 + 85 * stepCount);
            stepCount++;
          }
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // Save canvas function
  // --------------------------------------------------------------------------
  const saveCanvas = function() {

    redrawCanvas();

    const canvas = document.getElementById("menuCanvas") as HTMLCanvasElement | null;

    if (canvas) {
      let downloadLink = document.createElement('a');
      const d = new Date();
      downloadLink.setAttribute('download', 'menu-tipiktracho-'+d.toISOString().slice(0, 16).replace("T", " ")+'.png');
      let canvas = document.getElementById('menuCanvas') as HTMLCanvasElement;

      if (canvas) {
        canvas.toBlob(blob => {
          if (blob) {
            let url = URL.createObjectURL(blob);
            downloadLink.setAttribute('href', url);
            downloadLink.click();
          }
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // Move plate up
  // --------------------------------------------------------------------------
  const MovePlateUp = (n: number) => {
    if (n <= 0)
      return;

    const saveValue = SelectedPlate[n - 1].value;
    SelectedPlate[n - 1].value = SelectedPlate[n].value;
    SelectedPlate[n].value = saveValue

    const saveCustomName = CustomizedPlate[n - 1].value.name;
    CustomizedPlate[n - 1].value.name = CustomizedPlate[n].value.name;
    CustomizedPlate[n].value.name = saveCustomName

    const saveCustomPrice = CustomizedPlate[n - 1].value.price;
    CustomizedPlate[n - 1].value.price = CustomizedPlate[n].value.price;
    CustomizedPlate[n].value.price = saveCustomPrice
  };

  const MovePlateDown = (n: number) => {
    if (n >= SelectedPlate.length - 1)
      return;

    const saveValue = SelectedPlate[n + 1].value;
    SelectedPlate[n + 1].value = SelectedPlate[n].value;
    SelectedPlate[n].value = saveValue

    const saveCustomName = CustomizedPlate[n + 1].value.name;
    CustomizedPlate[n + 1].value.name = CustomizedPlate[n].value.name;
    CustomizedPlate[n].value.name = saveCustomName

    const saveCustomPrice = CustomizedPlate[n + 1].value.price;
    CustomizedPlate[n + 1].value.price = CustomizedPlate[n].value.price;
    CustomizedPlate[n].value.price = saveCustomPrice
  };

  // --------------------------------------------------------------------------
  // Mounted redraw
  // --------------------------------------------------------------------------
  /*onMounted(() => {
    redrawCanvas();
  });*/

  // --------------------------------------------------------------------------
  // Watches for redraws
  // --------------------------------------------------------------------------
  /*watch(SelectedBackground, () => {
    redrawCanvas();
  });

  watch(SelectedFeatured, () => {
    redrawCanvas();
  });*/

  /*SelectedPlate.forEach((plateRef) => {
    watch(plateRef, () => {
      redrawCanvas()
    })
  })*/

  const timeoutId = ref<number | null>(null);
  const TimeoutRedraw = () => {
    SaveData();
    redrawCanvas();
    timeoutId.value = setTimeout(()=>{
      TimeoutRedraw()
    }, 100)
    };

  onMounted(() => {
    LoadData();
    TimeoutRedraw();
  });

  onUnmounted(() => {
    if (timeoutId.value !== null) {
        clearTimeout(timeoutId.value);
    }
  });
  
</script>

<template>
  <div class="flex flex-col w-screen max-h-screen lg:h-screen bg-[#fafafa]" id = "base-Container">
    <div class="flex flex-col w-full h-[calc(100%-40px)] lg:flex-row">
      <div class="w-full lg:w-3/5 flex flex-col p-4 rounded-xl gap-y-5 lg:overflow-scroll p-8 order-3 lg:order-1">

        <!---<div class = "mi-caja">
          <div>
            Caja general sin formato
          </div>
          <div>
            <img class = "mi-imagen" src="https://olondriz.com/wp-content/uploads/2020/04/ambar-perrito-1.jpg">
          </div>
        </div>-->

        <label class = "font-bold">Configuración General</label>
        <div class = "p-4 bg-[#f0f0f0] gap-y-4 flex flex-col rounded-md">
          <div class = "flex flex-col w-full gap-y-2">
            <label class = "">Día de la semana</label>
            <select class = "py-2 px-4 bg-white rounded" v-model="SelectedBackground">
              <option :value = 0>Lunes</option>
              <option :value = 1>Martes</option>
              <option :value = 2>Miércoles</option>
              <option :value = 3>Jueves</option>
              <option :value = 4>Viernes</option>
              <option :value = 5>Sábado</option>
            </select>
          </div>
          
          <div class = "flex flex-col w-full gap-y-2">
            <label class = "flex">Plato destacado</label>
            <select class = "py-2 px-4 bg-white rounded" v-model="SelectedFeatured">
              <option :value = 0>Salpicón</option>
              <option :value = 1>Sopa de Caracol</option>
              <option :value = 2>Sopa de Pollo</option>
              <option :value = 3>Sopa de Res</option>
              <option :value = 4>Costillitas</option>
              <option :value = 5>Pollo al Horno</option>
              <option :value = 6>Marmahón</option>
            </select>
          </div>
        </div>

        <hr>

        <label class = "font-bold">Platos</label>
        <div class = "flex flex-col w-full gap-y-2 bg-[#f0f0f0] p-4 rounded-md" v-for="n in SelectedPlate.length">
          <div class = "flex gap-x-2">
            <div class = "w-full">
              <label class = "">Posición {{ n }}</label>
            </div>
            <button :class = "'rounded-md bg-black px-3 py-1 color-white '+ (n == 1 ? 'opacity-25' : '')"
              @click="MovePlateUp(n-1)">
              <img class = "pointer-events-none w-[16px]" :src="upIcon">
            </button>
            <button :class = "'rounded-md bg-black px-3 py-1 color-white '+ (n == SelectedPlate.length ? 'opacity-25' : '')"
              @click="MovePlateDown(n-1)">
              <img class = "pointer-events-none w-[16px]" :src="downIcon">
            </button>
          </div>
          <select class = "py-2 px-4 bg-white rounded" v-model="SelectedPlate[n - 1].value">
            <option :value = "n" v-for = "plateOption, n in PlateList">{{ plateOption.name }}</option>
            <option :value = -1>Personalizado</option>
            <option :value = -2>Ninguno</option>
          </select>
          <div v-if="SelectedPlate[n - 1].value == -1" class = "bg-[#e6e6e6] rounded-md p-4 flex flex-col gap-y-2 mt-2">
            <label>Nombre</label>
            <input type = "text" class = "py-2 px-4 rounded" placeholder="Escribe el nombre del plato aquí"
              v-model="CustomizedPlate[n-1].value.name">
            <label>Precio</label>
            <input type = "number" class = "py-2 px-4 rounded" value="100"
              v-model="CustomizedPlate[n-1].value.price">
          </div>
        </div>
      </div>

      <div class="w-full lg:w-2/5 h-[75vh] lg:h-full flex flex-col p-2 gap-y-5 lg:order-5">
        <div class = "w-full h-full relative">
          <div class = "w-full h-full absolute">
            <canvas class="border-2 w-full h-full object-contain " id="menuCanvas" width="1080" height="1920"></canvas>
          </div>
        </div>
        <div class = "w-full text-center border-1">
          <button class = "bg-black text-white px-4 py-2 rounded font-bold" @click="saveCanvas()">Descargar Imagen</button>
        </div>
      </div>
    </div>

    <div class="text-black text-center mt-2 lg:h-[40px] p-4 pt-0 lg:p-0 cloud-test">
      Desarrollado por <strong>Nehemek Amador</strong> © 2024
    </div>
    
  </div>
</template>

<style>
  @font-face {
    font-family: 'Cloud';
    src: url('/Cloud.otf');
  }
  .cloud-test {
    font-family: 'Cloud';
  }

  .mi-caja {
    background: #ff0000;
    font-weight: bold;
    padding: 40px;
    text-align: center;
    border-radius: 8px;
    color: white;
    display: flex;
  }

  .mi-caja > div {
    width: 100%;
  }

  .mi-imagen {
    width: 50px;
  }
</style>