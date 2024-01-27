<template>
  <div class="container is-fluid is-mobile mt-2">

    <section class="columns is-mobile" id="begin">
      <div class="column is-8 is-offset-1">
        <div>
          <p class="has-text-left is-size-5-mobile is-size-3-tablet">Como usar los enlaces</p>
        </div>
        <div class="is-flex">
          <ul>
            <li class="has-text-left">
              <a href="#frommobile">Desde el movil</a>
            </li>
            <li class="has-text-left">
              <a href="#frompc">Desde el ordenador</a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="columns is-mobile has-text-left mt-6" id="frommobile">
      <div class="column is-8 is-offset-1">

        <!-- HEADER -->
        <div class="block">
          <div class="title is-4">
            Para móvil
          </div>
          <p>
            Para usar estos enlaces desde el móvil primero debes instalar la aplicación acestream en tú dispositivo
          </p>
        </div>

        <!-- LINK -->
        <div class="block">
          <div>
            <div class="content is-vcentered is-flex">
              <a href="https://play.google.com/store/apps/details?id=org.acestream.node&hl=es&gl=US&pli=1"
                title="Acestream en Google Play" target="_blank">
                <div class="button rounded-icon is-dark is-outlined">
                  <font-awesome-icon icon="fa-brands fa-google-play" />
                </div>
              </a>
              <div class="title is-3 ml-3">
                Google Play
              </div>
            </div>
          </div>
        </div>

        <!-- CUERPO -->
        <div class="block">
          <div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="block">
          <a class="button rounded-icon is-primary is-outlined" href="#begin" title="Ir arriba">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-arrow-turn-up" />
            </span>
          </a>
        </div>

      </div>
    </section>

    <section class="columns is-mobile has-text-left mt-6" id="frompc">
      <div class="column is-8 is-offset-1">

        <!-- HEADER -->
        <div class="block">
          <div class="title is-4">
            Para ordenador
          </div>
          <p>
            Para usar estos enlaces desde el ordenador primero debes instalar la aplicación de acestream.
          </p>
        </div>

        <!-- LINK -->
        <div class="block">
          <div>
            <div class="content is-vcentered is-flex">
              <a href="https://acestream.org/" title="Acestream.org" target="_blank">
                <div class="button rounded-icon is-dark is-outlined">
                  <font-awesome-icon icon="fa-brands fa-windows" />/
                  <font-awesome-icon icon="fa-brands fa-linux" />
                </div>
              </a>
              <div class="title is-3 ml-3">
                Microsoft / Linux
              </div>
            </div>
          </div>
        </div>

        <!-- CUERPO -->
        <div class="block">
          <div>
            <p>
              Si tienes problemas para acceder, es posible que esté bloqueada en tu páis o este bloqueada por tu operador
              de internet.
              Si es así, puedes probar a utilizar una vpn para acceder.
            </p>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="block">
          <div class="">
            <a class="button rounded-icon is-primary is-outlined" href="#begin" title="Ir arriba">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-arrow-turn-up" />
              </span>
            </a>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
<style>
section {
  min-height: 250px;
}
</style>