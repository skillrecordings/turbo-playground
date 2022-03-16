import {motion} from 'framer-motion'

const Logo = () => {
  return (
    <>
      <svg
        className="p-0.5 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        width="193"
        height="32"
        fill="none"
        viewBox="0 0 193 32"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M58.667 31l3.214-3.105c.516-.5 1.336-.5 1.852 0l2.288 2.21c.517.5 1.336.5 1.853 0l2.271-2.194a1.333 1.333 0 011.87.016l2.13 2.13c.52.52 1.365.52 1.886 0l2.114-2.114c.52-.52 1.365-.52 1.886 0l2.114 2.114c.52.52 1.365.52 1.886 0l2.114-2.114c.52-.52 1.365-.52 1.886 0l2.114 2.114c.52.52 1.365.52 1.886 0l2.114-2.114c.52-.52 1.365-.52 1.886 0l2.114 2.114c.52.52 1.365.52 1.886 0l2.114-2.114a1.334 1.334 0 011.886 0l2.114 2.114c.521.52 1.365.52 1.886 0l2.114-2.114a1.334 1.334 0 011.886 0l2.114 2.114c.521.52 1.365.52 1.886 0L119.088 27"
        />
        <path
          fill="#fff"
          d="M12.316 5.734H1.383c-.235 0-.391.157-.391.392V7.9c0 .235.156.391.391.391h4.045V23.61c0 .234.156.391.391.391H7.88c.235 0 .392-.157.392-.391V8.29h4.044c.235 0 .392-.156.392-.391V6.126c0-.235-.157-.392-.392-.392zm12.704 5.48h-2.01a.478.478 0 00-.469.313l-3.497 9.29-3.496-9.29a.478.478 0 00-.47-.313h-1.983c-.287 0-.417.156-.313.444l4.906 12.394-1.827 4.462c-.104.287.026.444.313.444h1.957a.478.478 0 00.47-.313l6.732-16.987c.105-.287-.026-.444-.313-.444zm9.035-.287c-1.8 0-3.21.861-4.201 2.088l-.078-1.41c-.026-.235-.157-.391-.392-.391H27.61c-.235 0-.392.156-.392.391V23.61c0 .052 0 .104.026.156v4.801c0 .235.157.392.392.392h1.957c.235 0 .391-.157.391-.392v-6.132c.966 1.122 2.323 1.905 4.071 1.905 3.601 0 6.21-2.974 6.21-6.706 0-3.731-2.609-6.706-6.21-6.706zm-.287 10.907c-2.244 0-3.862-1.93-3.862-4.227 0-2.27 1.618-4.175 3.862-4.175 2.218 0 3.862 1.774 3.862 4.175 0 2.4-1.644 4.227-3.862 4.227zm14.41-10.907c-3.68 0-6.341 2.949-6.341 6.706 0 3.758 2.687 6.706 6.601 6.706 1.88 0 3.55-.73 4.75-1.957.208-.209.208-.391 0-.6l-.835-.809c-.183-.183-.34-.13-.548.026-.861.652-1.8 1.07-3.106 1.07-2.322 0-3.835-1.33-4.175-3.392h8.872c.705 0 .835-.47.835-1.435 0-3.366-2.348-6.315-6.053-6.315zm.026 2.348c1.957 0 3.418 1.383 3.6 3.497h-7.306c.261-2.114 1.749-3.497 3.706-3.497zm10.882-2.818c0-1.409 1.148-2.296 2.818-2.296 1.435 0 2.479.574 3.705 1.644.183.156.366.13.548-.052l1.07-1.253c.157-.209.157-.365 0-.548-1.383-1.487-3.262-2.426-5.375-2.426-3.001 0-5.506 1.93-5.506 4.88 0 5.949 8.976 4.826 8.976 8.61 0 1.54-1.383 2.662-3.314 2.662-1.748 0-3.027-.81-4.2-1.905-.183-.183-.392-.183-.549-.026l-1.174 1.252c-.183.157-.183.34-.052.522 1.174 1.487 3.34 2.818 5.95 2.818 3.209 0 6.131-2.087 6.131-5.245 0-6.262-9.028-4.905-9.028-8.637zm17.253 11.351c-2.27 0-3.862-1.8-3.862-4.175 0-2.4 1.592-4.201 3.862-4.201 1.566 0 2.375.73 3.132 1.383.208.183.39.209.574.026l1.148-1.096c.156-.156.182-.365.026-.548-1.2-1.383-2.923-2.27-4.906-2.27-3.68 0-6.471 2.949-6.471 6.706 0 3.758 2.792 6.706 6.471 6.706a6.527 6.527 0 004.984-2.27c.157-.183.13-.391-.026-.548l-1.148-1.096c-.183-.183-.366-.183-.574 0-.73.705-1.592 1.383-3.21 1.383zm14.559-10.385c-.365-.287-.94-.496-1.618-.496-1.461 0-2.505.783-3.21 1.93l-.104-1.252c-.026-.235-.156-.391-.391-.391h-1.827c-.235 0-.391.156-.391.391V23.61c0 .234.156.391.391.391h1.957c.235 0 .392-.157.392-.391v-7.385c0-1.592 1.122-2.792 2.74-2.792.495 0 .782.078 1.043.156.261.053.418.027.522-.234l.6-1.435c.105-.21.079-.34-.104-.496zm2.837-2.949c.887 0 1.592-.704 1.592-1.592 0-.887-.705-1.591-1.592-1.591-.887 0-1.592.704-1.592 1.591 0 .888.705 1.592 1.592 1.592zm-1.357 3.131V23.61c0 .234.157.391.391.391h1.957c.235 0 .392-.157.392-.391V11.605c0-.235-.157-.391-.391-.391h-1.958c-.234 0-.391.156-.391.391zm12.034-.678c-1.801 0-3.21.861-4.201 2.088l-.079-1.41c-.026-.235-.156-.391-.391-.391h-1.774c-.235 0-.392.156-.392.391V23.61c0 .052 0 .104.026.156v4.801c0 .235.157.392.392.392h1.957c.235 0 .391-.157.391-.392v-6.132c.966 1.122 2.323 1.905 4.071 1.905 3.601 0 6.21-2.974 6.21-6.706 0-3.731-2.609-6.706-6.21-6.706zm-.287 10.907c-2.244 0-3.862-1.93-3.862-4.227 0-2.27 1.618-4.175 3.862-4.175 2.218 0 3.862 1.774 3.862 4.175 0 2.4-1.644 4.227-3.862 4.227zm14.621-10.62h-1.827V7.691c0-.235-.157-.391-.391-.391h-1.957c-.235 0-.392.156-.392.391v3.523h-1.826c-.235 0-.392.156-.392.391v1.488c0 .235.157.391.392.391h1.826V23.61c0 .234.157.391.392.391h1.957c.234 0 .391-.157.391-.391V13.484h1.827c.234 0 .391-.156.391-.391v-1.488c0-.235-.157-.391-.391-.391z"
        />
        <path
          fill="currentColor"
          d="M135.508 20.352c-.139-.162-.324-.162-.485-.023-1.062.923-2.355 1.5-3.949 1.5-3.117 0-5.634-2.516-5.634-5.841 0-3.371 2.517-5.888 5.634-5.888 1.594 0 2.887.6 3.949 1.5.161.14.346.162.485 0l1.154-1.2c.139-.162.139-.346-.023-.485-1.455-1.362-3.348-2.263-5.542-2.263-4.594 0-8.22 3.672-8.22 8.336 0 4.618 3.626 8.312 8.22 8.312 2.194 0 4.087-.923 5.542-2.263.162-.161.162-.323.023-.485l-1.154-1.2zm7.864 3.948c3.233 0 5.796-2.609 5.796-5.934 0-3.348-2.563-5.934-5.796-5.934-3.256 0-5.795 2.586-5.795 5.934 0 3.325 2.539 5.934 5.795 5.934zm0-2.24c-1.939 0-3.463-1.547-3.463-3.694 0-2.17 1.524-3.717 3.463-3.717 1.94 0 3.464 1.547 3.464 3.717 0 2.147-1.524 3.694-3.464 3.694zm17.191-9.374h-1.732c-.207 0-.346.138-.346.346v6.58c0 .763-.993 2.472-2.886 2.472-1.362 0-2.402-.855-2.402-2.817v-6.235c0-.208-.138-.346-.346-.346h-1.732c-.207 0-.346.138-.346.346v6.58c0 3.026 1.663 4.688 4.225 4.688 1.548 0 2.702-.854 3.487-1.986l.092 1.34c.024.207.139.346.347.346h1.639c.208 0 .347-.139.347-.346V13.032c0-.208-.139-.346-.347-.346zm9.243.185c-.324-.254-.832-.44-1.432-.44-1.293 0-2.217.694-2.84 1.71l-.093-1.109c-.023-.208-.138-.346-.346-.346h-1.616c-.208 0-.347.138-.347.346v10.622c0 .207.139.346.347.346h1.732c.207 0 .346-.139.346-.346v-6.535c0-1.408.993-2.47 2.424-2.47.439 0 .693.069.924.138.231.046.369.023.462-.208l.531-1.27c.092-.184.069-.3-.092-.438zm3.457 2.817c0-.878.808-1.27 1.593-1.27.923 0 1.547.346 2.447 1.039.185.138.37.207.508.023l.647-.854c.115-.162.162-.324.023-.485-.947-1.109-2.424-1.71-3.764-1.71-2.032 0-3.786 1.27-3.786 3.28 0 3.786 5.818 3.001 5.818 5.218 0 .9-.831 1.293-1.847 1.293-1.154 0-2.217-.646-2.979-1.224-.207-.161-.346-.207-.508 0l-.715.947c-.093.139-.116.3.023.462.808.947 2.332 1.893 4.248 1.893 2.032 0 4.133-1.27 4.133-3.325 0-4.087-5.841-3.094-5.841-5.287zm12.835-3.256c-3.256 0-5.611 2.61-5.611 5.934 0 3.325 2.378 5.934 5.842 5.934 1.662 0 3.14-.646 4.202-1.732.185-.184.185-.346 0-.53l-.739-.716c-.161-.162-.3-.116-.485.023-.762.577-1.593.946-2.747.946-2.055 0-3.395-1.177-3.695-3.001h7.851c.623 0 .739-.416.739-1.27 0-2.979-2.078-5.588-5.357-5.588zm.023 2.078c1.732 0 3.025 1.224 3.186 3.094h-6.465c.231-1.87 1.547-3.094 3.279-3.094z"
        />
      </svg>
    </>
  )
}

export default Logo
