<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

const page = ref<HTMLElement | null>(null)
const isEntering = ref(false)

let introTimeline: gsap.core.Timeline | null = null
let ambientTweens: gsap.core.Tween[] = []
let birdFlightTween: gsap.core.Timeline | null = null
let birdDelayTween: gsap.core.Tween | null = null

onMounted(() => {
  if (!page.value) return

  /*
   * ------------------------------------------------------------
   * INITIAL STATE
   * ------------------------------------------------------------
   */

  gsap.set(
    [
      '.landing-background',
      '.landing-fog',
      '.landing-vines',
      '.landing-door',
      '.landing-character',
      '.landing-bird',
      '.landing-content',
    ],
    {
      opacity: 0,
    },
  )

  gsap.set('.landing-door', {
    scale: 0.92,
  })

  gsap.set('.landing-character', {
    y: 35,
    scale: 0.96,
  })

  gsap.set('.landing-bird', {
    opacity: 0,
    x: '-12vw',
  })

  gsap.set('.landing-content', {
    y: 20,
  })

  /*
   * ------------------------------------------------------------
   * CINEMATIC INTRO
   * ------------------------------------------------------------
   *
   * Deliberately slower than the previous version.
   * The elements overlap only slightly so the scene has time
   * to breathe.
   */

  introTimeline = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  })

  introTimeline
    // Environment
    .to('.landing-background', {
      opacity: 1,
      scale: 1,
      duration: 3.5,
      ease: 'power2.inOut',
    })

    // Fog slowly appears
    .to(
      '.landing-fog',
      {
        opacity: 0.32,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=1.8',
    )

    // Vines emerge
    .to(
      '.landing-vines',
      {
        opacity: 0.55,
        duration: 2.8,
        ease: 'power2.out',
      },
      '-=1.2',
    )

    // Door slowly becomes the focal point
    .to(
      '.landing-door',
      {
        opacity: 1,
        scale: 1,
        duration: 3,
        ease: 'power2.inOut',
      },
      '-=0.8',
    )

    // Character
    .to(
      '.landing-character',
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2.5,
        ease: 'power2.out',
      },
      '-=1',
    )

    // Bird appears
    .to(
      '.landing-bird',
      {
        opacity: 0.75,
        duration: 1.8,
        ease: 'power2.out',
      },
      '-=0.8',
    )

    // Final content
    .to(
      '.landing-content',
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out',
      },
      '+=0.2',
    )

  /*
   * ------------------------------------------------------------
   * AMBIENT MOVEMENT
   * ------------------------------------------------------------
   */

  const fogTween = gsap.to('.landing-fog', {
    x: 35,
    duration: 16,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  const vinesTween = gsap.to('.landing-vines', {
    x: 7,
    rotation: 0.3,
    duration: 11,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  const characterTween = gsap.to('.landing-character', {
    y: -7,
    duration: 5.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  /*
   * NFT INSIDE BUTTON
   *
   * Very subtle floating movement.
   */
  const nftTween = gsap.to('.landing-nft', {
    y: -5,
    rotation: 1,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  ambientTweens = [
    fogTween,
    vinesTween,
    characterTween,
    nftTween,
  ]

  /*
   * ------------------------------------------------------------
   * BIRD
   * ------------------------------------------------------------
   *
   * Slowly travels from left to right.
   *
   * It waits until the initial scene has appeared before
   * beginning its movement.
   */

  /*const startBirdFlight = () => {
    gsap.fromTo(
      '.landing-bird',
      {
        x: '-15vw',
      },
      {
        x: '115vw',
        duration: 28,
        ease: 'none',
        repeat: -1,
        repeatDelay: 5,
      },
    )
  }

  gsap.delayedCall(4.5, startBirdFlight) */
  /*
 * ------------------------------------------------------------
 * BIRD FLIGHT
 * ------------------------------------------------------------
 *
 * One bird at a time.
 * Each flight gets a different direction, height,
 * scale and speed so the movement doesn't feel repetitive.
 */

const flyBird = () => {
  const bird = document.querySelector('.landing-bird') as HTMLElement | null

  if (!bird || isEntering.value) return

  const leftToRight = Math.random() > 0.5

  const startX = leftToRight ? '-12vw' : '112vw'
  const endX = leftToRight ? '112vw' : '-12vw'

  const positions = ['15%', '22%', '30%', '38%']
  const randomTop =
    positions[Math.floor(Math.random() * positions.length)]

  const sizes = [58, 68, 78]
  const randomSize =
    sizes[Math.floor(Math.random() * sizes.length)]

  const durations = [22, 27, 32]
  const randomDuration =
    durations[Math.floor(Math.random() * durations.length)]

  gsap.set(bird, {
    left: 0,
    top: randomTop,
    width: `${randomSize}px`,
    x: startX,
    scaleX: leftToRight ? 1 : -1,
    opacity: 0,
  })

  birdFlightTween?.kill()

  birdFlightTween = gsap.timeline()
    .to(bird, {
      opacity: 0.55,
      duration: 1.5,
      ease: 'power2.out',
    })
    .to(
      bird,
      {
        x: endX,
        duration: randomDuration,
        ease: 'none',
      },
      '<',
    )
    .to(bird, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in',
    })

  birdDelayTween = gsap.delayedCall(
    5 + Math.random() * 8,
    flyBird,
  )
}

birdDelayTween = gsap.delayedCall(5, flyBird)
})

onBeforeUnmount(() => {
  introTimeline?.kill()
  birdFlightTween?.kill()
 birdDelayTween?.kill()

  ambientTweens.forEach((tween) => tween.kill())

  gsap.killTweensOf([
    '.landing-background',
    '.landing-fog',
    '.landing-vines',
    '.landing-door',
    '.landing-character',
    '.landing-bird',
    '.landing-content',
    '.landing-nft',
    '.landing-bird'
  ])
})

/*
 * ------------------------------------------------------------
 * ENTER THE ABYSS
 * ------------------------------------------------------------
 */

const enterAbyss = () => {
  if (isEntering.value) return

  isEntering.value = true

  // Stop ambient movement before transition
  ambientTweens.forEach((tween) => tween.pause())

  const transitionTimeline = gsap.timeline({
    onComplete: () => {
      router.push('/abyss')
    },
  })

  transitionTimeline

    /*
     * Button fades slightly first.
     */
    .to('.landing-enter', {
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      ease: 'power2.inOut',
    })

    /*
     * The whole foreground scene begins disappearing.
     */
    .to(
      '.landing-content, .landing-character',
      {
        opacity: 0,
        y: -25,
        duration: 1.4,
        ease: 'power2.inOut',
      },
      '-=0.35',
    )

    /*
     * Vines pull back into darkness.
     */
    .to(
      '.landing-vines',
      {
        opacity: 0.15,
        scale: 1.08,
        duration: 1.8,
        ease: 'power2.inOut',
      },
      '-=0.9',
    )

    /*
     * Bird disappears into the darkness.
     */
    .to(
      '.landing-bird',
      {
        opacity: 0,
        x: '25vw',
        duration: 1.5,
        ease: 'power2.inOut',
      },
      '-=1.4',
    )

    /*
     * Fog becomes heavier.
     */
    .to(
      '.landing-fog',
      {
        opacity: 0.72,
        scale: 1.15,
        duration: 2.5,
        ease: 'power2.inOut',
      },
      '-=1.2',
    )

    /*
     * --------------------------------------------------------
     * THE DOOR
     * --------------------------------------------------------
     *
     * This is the important part.
     *
     * The door gradually fills the viewport, creating the
     * feeling that the viewer is moving toward it.
     */
    .to(
      '.landing-door',
      {
        scale: 1.45,
        duration: 4,
        ease: 'power3.in',
      },
      '-=1.8',
    )

    /*
     * Slightly darker as we approach the door.
     */
    .to(
      '.landing-door',
      {
        filter: 'brightness(0.75)',
        duration: 1.5,
      },
      '-=1.5',
    )

    /*
     * Final darkness.
     */
    .to(
      '.landing-blackout',
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.in',
      },
      '-=0.5',
    )
}
</script>

<template>
  <main
    ref="page"
    class="relative min-h-[100svh] w-full overflow-hidden bg-black text-white"
  >
    <!-- ========================================================= -->
    <!-- MAIN ENVIRONMENT                                          -->
    <!-- ========================================================= -->

    <div class="absolute inset-0">
      <img
        src="/AfterlightBackground.jpg"
        alt=""
        class="landing-background absolute inset-0 h-full w-full object-cover object-center"
      />

      <!-- Cinematic darkness -->
      <div
        class="pointer-events-none absolute inset-0 bg-black/30"
      />

      <!-- Vignette -->
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(0, 0, 0, 0.35) 55%,
              rgba(0, 0, 0, 0.92) 100%
            );
        "
      />
    </div>

    <!-- ========================================================= -->
    <!-- ANCIENT DOOR                                              -->
    <!-- ========================================================= -->

    <!--<div
      class="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        z-20
        h-[88svh]
        w-[96vw]
        -translate-x-1/2
        -translate-y-1/2
        sm:h-[92svh]
        sm:w-[92vw]
        lg:h-[96svh]
        lg:w-[88vw]
      "
    >
      <img
        src="/AncientDoor.jpg"
        alt=""
        class="
          landing-door
          h-full
          w-full
          object-cover
          object-center
          opacity-0
        "
      />
    </div> -->
    <div
        class="
            landing-door-frame
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-20
            h-[88svh]
            w-[96vw]
            -translate-x-1/2
            -translate-y-1/2
            sm:h-[92svh]
            sm:w-[92vw]
            lg:h-[96svh]
            lg:w-[88vw]
        "
        >
        <img
            src="/AncientDoor.jpg"
            alt=""
            class="
            landing-door
            h-full
            w-full
            object-cover
            object-center
            opacity-0
            "
        />

        <!-- Softly blends the door into the surrounding environment -->
        <div
            class="
            landing-door-fade
            pointer-events-none
            absolute
            inset-0
            "
        />
        </div>

    <!-- ========================================================= -->
    <!-- FOG                                                       -->
    <!-- ========================================================= -->

    <img
      src="/fog.jpg"
      alt=""
      class="
        landing-fog
        pointer-events-none
        absolute
        -inset-x-20
        bottom-0
        z-30
        h-[48%]
        w-[140%]
        object-cover
        opacity-0
        mix-blend-screen
        sm:h-[55%]
      "
    />

    <!-- ========================================================= -->
    <!-- VINES                                                     -->
    <!-- ========================================================= -->

    <img
      src="/vines.jpg"
      alt=""
      class="
        landing-vines
        pointer-events-none
        absolute
        inset-0
        z-35
        h-full
        w-full
        object-cover
        opacity-0
        mix-blend-screen
      "
    />

    <!-- ========================================================= -->
    <!-- BIRD                                                       -->
    <!-- ========================================================= -->

    <img
      src="/birds-removebg.png"
      alt=""
      class="
        landing-bird
        pointer-events-none
        absolute
        left-0
        top-[22%]
        z-40
        w-[70px]
        object-contain
        opacity-0
        sm:top-[20%]
        sm:w-[80px]
        md:w-[90px]
      "
    />

    <!-- ========================================================= -->
    <!-- CONTENT / ENTER BOX                                       -->
    <!-- ========================================================= -->

    <section
      class="
        landing-content
        pointer-events-none
        absolute
        inset-0
        z-50
        flex
        items-center
        justify-center
        px-5
        text-center
        opacity-0
      "
    >
      <div
        class="
          flex
          w-full
          max-w-[360px]
          flex-col
          items-center
          sm:max-w-[390px]
          md:max-w-[420px]
        "
      >
        <!-- Subtitle -->
        <p
          class="
            landing-subtitle
            mb-7
            max-w-[290px]
            text-[9px]
            uppercase
            leading-[1.8]
            tracking-[0.35em]
            text-white/65
            sm:max-w-none
            sm:text-[10px]
            sm:tracking-[0.5em]
          "
        >
          <span class="sm:hidden">
            Something waits<br />
            beyond the light
          </span>

          <span class="hidden sm:inline">
            Something waits beyond the light
          </span>
        </p>

        <!-- ===================================================== -->
        <!-- ENTER THE ABYSS BOX                                   -->
        <!-- ===================================================== -->

        <button
          type="button"
          :disabled="isEntering"
          class="
            landing-enter
            group
            pointer-events-auto
            relative
            flex
            min-h-[92px]
            w-full
            items-center
            justify-center
            gap-4
            overflow-hidden
            border
            border-white/30
            bg-black/35
            px-5
            py-4
            backdrop-blur-[3px]
            transition-all
            duration-700
            hover:border-white/70
            hover:bg-black/50
            disabled:pointer-events-none
          "
          @click="enterAbyss"
        >
          <!-- Hover light -->
          <span
            class="
              absolute
              inset-0
              -translate-x-full
              bg-white/10
              transition-transform
              duration-1000
              group-hover:translate-x-0
            "
          />

          <!-- NFT -->
          <span
            class="
              relative
              z-10
              flex
              h-[58px]
              w-[58px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/20
              bg-black/60
            "
          >
            <img
              src="/nftAfterlight.jpeg"
              alt=""
              class="
                landing-nft
                h-[82px]
                w-[82px]
                max-w-none
                object-cover
              "
            />
          </span>

          <!-- Button text -->
          <span
            class="
              relative
              z-10
              text-[10px]
              font-light
              uppercase
              tracking-[0.32em]
              text-white/90
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            Enter the Abyss
          </span>
        </button>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- BOTTOM SHADOW                                             -->
    <!-- ========================================================= -->

    <div
      class="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        z-[45]
        h-[38%]
        bg-gradient-to-t
        from-black
        via-black/40
        to-transparent
      "
    />

    <!-- ========================================================= -->
    <!-- BLACK TRANSITION                                          -->
    <!-- ========================================================= -->

    <div
      class="
        landing-blackout
        pointer-events-none
        fixed
        inset-0
        z-[100]
        bg-black
        opacity-0
      "
    />
  </main>
</template>
<style scoped>
.landing-door-frame {
  -webkit-mask-image:
    radial-gradient(
      ellipse 72% 78% at center,
      black 45%,
      rgba(0, 0, 0, 0.9) 60%,
      rgba(0, 0, 0, 0.45) 78%,
      transparent 100%
    );

  mask-image:
    radial-gradient(
      ellipse 72% 78% at center,
      black 45%,
      rgba(0, 0, 0, 0.9) 60%,
      rgba(0, 0, 0, 0.45) 78%,
      transparent 100%
    );
}

.landing-door-fade {
  background:
    radial-gradient(
      ellipse at center,
      transparent 45%,
      rgba(0, 0, 0, 0.12) 62%,
      rgba(0, 0, 0, 0.5) 82%,
      rgba(0, 0, 0, 0.85) 100%
    );
}
</style>