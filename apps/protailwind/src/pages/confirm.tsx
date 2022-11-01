import React from 'react'
import Layout from 'components/layout'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex-grow flex items-center justify-center flex-col p-5 min-h-screen bg-blue-600 text-white">
        <Image />
        <div className="max-w-lg text-center font-light">
          {/* <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p> */}
          <h1 className="font-black lg:text-4xl text-3xl py-8 font-heading">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="sm:text-lg text-blue-100 leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>team@protailwind.com</strong> to your contacts.
          </p>
          <p className="sm:text-lg text-white">
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 mx-auto"
      fill="none"
      viewBox="0 0 88 54"
    >
      <path
        fill="currentColor"
        d="M10.655 28.229c-2.845-.164-6.142-.775-6.846-2.78a5.344 5.344 0 0 1-.302-1.392c-.222-2.846 1.81-5.675 4.897-8.169 1.725-1.39 4.995-3.19 7.714-3.402 1.087-.085 2.066.096 2.847.614.618.5.902 1.25.972 2.145.105 1.343-.314 2.984-.932 4.545-.255.857.554.504 1.015-.594.62-1.529 1.057-2.946.962-4.162-.075-.96-.462-1.798-1.324-2.535-1.258-.867-2.794-1.165-4.393-1.04-2.686.21-5.57 1.593-7.876 3.382-2.817 2.248-5.266 5.496-5.001 8.886.05.64.198 1.303.474 1.957 1.042 2.622 4.853 3.225 7.988 3.398 2.264.145 5.303.326 7.282 1.362-3.802 1.584-7.345 3.599-9.485 5.857-1.013 1.045-1.604 2.12-1.59 3.117.15 1.919 2.049 2.35 3.84 2.21.512-.04.986-.142 1.43-.24 4.545-1.128 9.316-4.3 9.019-8.106-.085-1.087-.504-1.923-1.167-2.58l2.75-1.05 3.848-1.395c.22-.082.249-.116.076-.264-.305-.201-1.356-.055-4.277.85A43.31 43.31 0 0 0 19.288 30c-2.438-1.547-6.434-1.621-8.633-1.771Zm9.495 4.986c.088 3.596-4.556 6.34-8.083 7.324-.63.178-1.2.287-1.712.326-1.343.105-2.274-.272-2.339-1.104-.052-.671.421-1.61 1.613-2.829 1.787-1.845 4.789-3.784 9.522-5.795.557.535.932 1.214 1 2.078Zm6.3-2.68c.66.624 1.54.748 2.336.654 2.2-.269 4.912-3.023 5.433-4.19.328-.733-.006-.9-.124-.762-.885 1.034-4.075 3.858-6.058 4.013a1.528 1.528 0 0 1-.95-.216c-.512-.378-.155-4.042.081-4.318.02-.162-.192-.403-.554-.503-.391-.066-.709-.01-.728.153-.31.571-.424 1.578-.346 2.569.082 1.055.39 2.125.91 2.6Zm.093-7.473c.3.138.684.108.77-.028.083-.167.284-.89.335-1.055.081-.2.064-.424.054-.552.051-.165-.224-.4-.648-.464-.33-.103-.676-.011-.661.18l-.027.485c-.051.165-.225.822-.282.923-.15.14.065.413.459.511Zm7.771 6.311c.126.376 1.008.951 1.246.707 1.162-1.185 1.925-2.95 3.474-4.132.385 1.224.635 1.945 1.01 2.624.219.337.851.609 1.097.46.819-.642 1.568-1.344 2.915-2.64.119.28.306.62.555.922.318.361.667.72 1.172 1.002a4.05 4.05 0 0 0 2.193.473c1.823-.143 3.779-1.872 4.191-2.773.33-.734-.107-.957-.19-.79-.388.803-3.751 2.642-4.775 2.722-.447.035-.844-.095-1.213-.291-.682-.494-.932-1.633-1.302-2.247-.251-.335-.884-.607-1.095-.43l-2.905 2.77c-.375-1.098-.46-1.767-.876-2.57-.284-.333-.852-.61-1.098-.462-1.323.779-2.31 2.143-3.335 3.446-.114-1.053-.031-1.639-.128-2.468.063-.423-1.047-1.044-1.1-.493-.066.81-.09 1.745-.01 2.768.035.448.105.925.174 1.402Zm26.708-4.693c.747-.315.939-.748.014-.644-.288.022-1.525.248-3.028.365-.736.058-1.57.09-2.377.057-.525-.538-1.26-.899-2.134-.96-.642.019-.839.388-.932.846-.064.005-.093.04-.157.044-.716.313-1.427 1.913-1.099 3.24.23.882 1.107 1.811 2.296 1.783 1.478-.02 2.727-.921 2.89-2.543a2.838 2.838 0 0 0-.171-1.37c1.958-.056 4.014-.507 4.698-.818Zm-7.92.362.06-.07c.47.254 1.092.398 1.838.468.602 1.112.04 2.99-1.362 3.164-.605.08-.984-.245-1.217-1.16-.23-.883.29-2.05.681-2.402Zm7.902 2.664c.072.51 1.214.71 1.15.297l-.026-.738c.503-1.39 2.814-3.116 5.16-3.557a6.565 6.565 0 0 0-.01 1.095c.044.576.182 1.112.54 1.567.64.786 1.694 1.09 2.621 1.018 2.239-.175 4.185-2.033 4.875-3.084.433-.645.25-1.339.127-1.265-.984.592-3.569 3.336-5.551 3.49-.416.033-.775-.035-1.115-.266-.464-.575-.207-1.818-.25-2.362-.037-.48-.657-1.01-1.27-1.027-1.806-.052-4.018 1.28-5.043 2.164l-.021-1.092c.017-.195-.294-.46-.562-.6-.33-.103-.647-.046-.63.178l-.07 3.223c-.034.389.023.706.075.96Zm17.359-6.142.831-.065c.469-1.513.926-2.491 2.883-5.668 1.327-2.15 1.676-3.368 1.578-4.624-.121-1.555-1.6-2.72-3.12-2.602-1.114.087-2.078.732-2.624 1.93-.709-1.1-1.76-1.587-2.857-1.502-1.556.122-2.8 1.5-2.678 3.056.1 1.29.729 2.504 2.275 4.304 2.408 2.818 2.972 3.663 3.712 5.17Zm.287-1.57c-.576-.987-1.431-2.147-2.564-3.446-1.135-1.317-1.867-2.273-2.181-2.871-.314-.598-.5-1.153-.54-1.666-.078-1.007.759-1.909 1.767-1.988.972-.076 1.897.617 2.464 2.174l.901-.07c.293-1.5 1.09-2.452 2.115-2.532 1.026-.08 1.974.682 2.053 1.69.041.53-.054 1.125-.289 1.765-.234.641-.807 1.736-1.738 3.249-.931 1.514-1.617 2.759-1.988 3.695Z"
      />
    </svg>
  )
}

const Image = () => {
  return (
    <svg
      className="w-24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 72 77"
    >
      <path
        fill="#64748B"
        d="M36 61.042c-.292 0-.583-.081-.84-.244L.726 38.885a1.568 1.568 0 0 1 .14-2.721L36 14.086l35.134 22.076a1.568 1.568 0 0 1 .14 2.722L36.842 60.798a1.566 1.566 0 0 1-.84.244Z"
      />
      <path
        fill="url(#a)"
        d="M59.478 62.607H12.522V6.261c0-.864.702-1.565 1.566-1.565h43.825c.864 0 1.565.7 1.565 1.565v56.346Z"
      />
      <path
        fill="#7688A2"
        d="M70.434 76.694a1.61 1.61 0 0 1-.394-.05l-35.999-9.392.394-10.906L72 37.564v37.564a1.566 1.566 0 0 1-1.565 1.565Z"
      />
      <path
        fill="#8E9EB6"
        d="M70.434 76.694H1.566a1.565 1.565 0 0 1-1.565-1.566V37.564l71.183 36.19a1.566 1.566 0 0 1-.75 2.94Z"
      />
      <path
        fill="#CBD5E1"
        d="M48.522 17.217H23.48a1.565 1.565 0 1 1 0-3.13h25.043a1.565 1.565 0 1 1 0 3.13Zm-4.174 6.261H27.653c-.576 0-1.044-.7-1.044-1.565 0-.866.468-1.566 1.044-1.566h16.695c.576 0 1.044.7 1.044 1.566 0 .865-.468 1.565-1.044 1.565Z"
      />
      <rect
        width="36.223"
        height="14.087"
        x="18"
        y="29.738"
        fill="#2563EB"
        rx="7.043"
      />
      <path
        fill="#fff"
        d="M24.825 39.291c-.489 0-.908-.094-1.259-.282a1.952 1.952 0 0 1-.807-.795c-.184-.342-.276-.743-.276-1.202 0-.342.052-.653.157-.933.108-.28.263-.52.463-.72.205-.2.45-.352.739-.457a2.819 2.819 0 0 1 1.578-.093c.208.041.392.106.55.194a.54.54 0 0 1 .245.237.49.49 0 0 1 .044.295.564.564 0 0 1-.107.269.44.44 0 0 1-.225.163.417.417 0 0 1-.3-.044 1.913 1.913 0 0 0-.377-.132 1.43 1.43 0 0 0-.381-.05c-.26 0-.476.05-.651.15a.918.918 0 0 0-.389.426 1.64 1.64 0 0 0-.131.695c0 .276.044.51.131.701a.953.953 0 0 0 .389.432c.175.096.392.144.65.144.11 0 .226-.012.351-.037.125-.03.248-.073.37-.132a.509.509 0 0 1 .331-.043c.1.025.18.075.238.15a.541.541 0 0 1 .12.263.468.468 0 0 1-.045.288.482.482 0 0 1-.225.231 1.877 1.877 0 0 1-.545.207 2.78 2.78 0 0 1-.638.075Zm3.75 0c-.446 0-.839-.094-1.177-.282a2.023 2.023 0 0 1-.789-.801c-.183-.342-.275-.74-.275-1.196 0-.342.052-.653.156-.933.109-.28.261-.52.457-.72.2-.2.439-.352.714-.457.276-.108.58-.163.914-.163.447 0 .837.094 1.17.282.339.188.602.453.79.795.188.338.282.737.282 1.196 0 .342-.055.653-.163.933a2.003 2.003 0 0 1-1.165 1.19 2.56 2.56 0 0 1-.914.156Zm0-.964a.983.983 0 0 0 .564-.157.998.998 0 0 0 .357-.45c.083-.197.125-.432.125-.708 0-.413-.092-.734-.276-.964-.183-.23-.44-.344-.77-.344-.217 0-.405.052-.563.156a.958.958 0 0 0-.357.445 1.775 1.775 0 0 0-.125.707c0 .413.091.737.275.97.184.23.44.345.77.345Zm3.147.952c-.175 0-.309-.046-.4-.138-.092-.092-.138-.228-.138-.407v-3.412c0-.184.046-.324.137-.42a.47.47 0 0 1 .363-.15.56.56 0 0 1 .313.075c.076.05.16.134.251.25l1.985 2.48h-.176V35.29c0-.175.044-.308.132-.4.092-.092.225-.138.4-.138.176 0 .307.046.395.138.092.092.138.225.138.4v3.469a.561.561 0 0 1-.126.382.434.434 0 0 1-.338.138.655.655 0 0 1-.338-.076 1.288 1.288 0 0 1-.256-.25l-1.985-2.486h.175v2.267c0 .18-.046.315-.137.407-.088.092-.22.138-.395.138Zm4.475 0c-.183 0-.327-.05-.432-.15-.1-.105-.15-.253-.15-.445v-3.28c0-.193.05-.339.15-.44.105-.103.255-.156.451-.156h2.085c.15 0 .263.038.338.113.075.075.113.184.113.326a.474.474 0 0 1-.113.338c-.075.075-.188.112-.338.112h-1.534v.89h1.396c.146 0 .257.037.332.112.08.075.119.184.119.326 0 .146-.04.256-.119.331-.075.076-.186.113-.332.113h-1.396v1.215c0 .396-.19.595-.57.595Zm3.307 0c-.184 0-.326-.05-.426-.15-.1-.105-.15-.251-.15-.439v-3.35c0-.192.05-.338.15-.438.1-.1.242-.15.426-.15.187 0 .33.05.425.15.1.1.15.246.15.438v3.35c0 .188-.047.334-.143.438-.096.1-.24.15-.432.15Zm1.637 0c-.184 0-.326-.05-.426-.15-.1-.105-.15-.25-.15-.433v-3.305c0-.188.05-.332.15-.432.104-.1.248-.15.432-.15h1.54c.501 0 .887.123 1.159.369.275.242.413.58.413 1.014a1.4 1.4 0 0 1-.188.733 1.21 1.21 0 0 1-.532.475c-.23.109-.514.163-.852.163l.05-.113h.3c.18 0 .339.044.477.132a.956.956 0 0 1 .344.388l.313.563c.067.121.098.24.094.357a.376.376 0 0 1-.138.282c-.083.071-.206.107-.37.107a.73.73 0 0 1-.4-.1.883.883 0 0 1-.269-.314l-.57-1.045a.4.4 0 0 0-.194-.188.582.582 0 0 0-.263-.056h-.344v1.12c0 .184-.048.328-.144.432-.096.1-.24.15-.432.15Zm.576-2.517h.764c.22 0 .39-.044.507-.132.117-.087.175-.223.175-.407 0-.175-.058-.306-.175-.394-.117-.092-.286-.138-.507-.138h-.764v1.07Zm3.487 2.517c-.166 0-.296-.046-.388-.138-.087-.092-.131-.221-.131-.388v-3.475c0-.171.048-.3.144-.388.096-.092.231-.138.407-.138.146 0 .26.03.344.088a.721.721 0 0 1 .238.275l1.346 2.417h-.22l1.34-2.417a.798.798 0 0 1 .239-.275.623.623 0 0 1 .35-.088c.167 0 .294.046.382.138.092.087.138.217.138.388v3.475c0 .167-.044.296-.132.388-.087.092-.217.138-.388.138-.167 0-.296-.046-.388-.138-.088-.092-.131-.221-.131-.388v-2.154h.131l-1.008 1.753a.705.705 0 0 1-.188.207.426.426 0 0 1-.256.068.444.444 0 0 1-.257-.069.639.639 0 0 1-.182-.206l-1.014-1.76h.144v2.16c0 .168-.044.297-.131.389-.088.092-.217.138-.389.138Z"
      />
      <circle cx="57.913" cy="7.826" r="7.826" fill="url(#b)" />
      <path
        fill="#fff"
        d="M57.563 11.469h1.19V4.165h-.814c-.282.71-.69.907-1.753.918v.835c.47 0 .928-.021 1.377-.063v5.614Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1="36"
          x2="36"
          y1="30.847"
          y2="62.607"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#ECF3FF" />
          <stop offset="1" stop-color="#BECBE2" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="57.913"
          x2="57.913"
          y1="0"
          y2="15.652"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4C42" />
          <stop offset="1" stop-color="#E72C22" />
        </linearGradient>
      </defs>
    </svg>
  )
}
