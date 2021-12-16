import * as React from 'react'
import Link from 'next/link'
import {useTheme} from 'next-themes'
import {motion} from 'framer-motion'

const Navigation = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const {resolvedTheme, setTheme} = useTheme()
  const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light'
  const currentLight = resolvedTheme === 'light'
  return (
    <nav className="p-3 w-full flex items-center justify-center relative">
      <Link href="/">
        <a className="p-3 sm:w-32 w-28">
          <svg
            viewBox="0 0 554 263"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              // ⚡️ bolt
              d="M157.21 27.49C151.66 27.44 146.1 27.41 140.55 27.34C139.456 27.3552 138.396 26.9653 137.572 26.2452C136.749 25.5252 136.221 24.526 136.09 23.44C135.984 22.3713 136.278 21.3013 136.915 20.4369C137.553 19.5724 138.488 18.975 139.54 18.76C141.08 18.47 142.67 18.41 144.24 18.26L168.6 16.09C174.75 15.55 180.89 15.05 187.04 14.5C193.99 13.88 200.93 13.22 207.88 12.6C213.33 12.12 218.78 11.69 224.23 11.21C230.27 10.67 236.33 10.09 242.33 9.53997C246.68 9.13997 251.04 8.78997 255.39 8.39997L271.85 6.90998C276.23 6.51998 280.63 6.15998 285.02 5.76998C290.46 5.28998 295.91 4.76997 301.36 4.28997L314.53 3.13997C319.98 2.65997 325.43 2.14998 330.87 1.65998L344.15 0.509969C345.58 0.389969 347.01 0.27997 348.43 0.11997C352.17 -0.31003 354.62 2.50998 353.5 6.04998C352.26 9.95998 350.94 13.86 349.66 17.76C349.5 18.23 349.36 18.71 349.18 19.31H358.47H453.36C455.94 19.31 457.61 20.52 458.15 22.78C458.283 23.3126 458.309 23.8661 458.227 24.4088C458.145 24.9515 457.956 25.4726 457.671 25.942C457.387 26.4114 457.012 26.8199 456.569 27.144C456.126 27.468 455.624 27.7011 455.09 27.83C452.54 28.38 449.96 28.73 447.39 29.13C442.91 29.83 438.4 30.51 433.91 31.2C427.857 32.12 421.807 33.05 415.76 33.99C410.47 34.8 405.18 35.64 399.89 36.46L381.89 39.23L368.89 41.23L350.74 44.02L337.81 46.02C331.72 46.96 325.63 47.88 319.55 48.83C315.17 49.51 310.79 50.24 306.4 50.89C304.941 51.1975 303.445 51.2885 301.96 51.16C301.399 51.0594 300.866 50.8431 300.394 50.525C299.921 50.2068 299.52 49.7937 299.216 49.312C298.912 48.8303 298.712 48.2906 298.629 47.7272C298.545 47.1639 298.579 46.5892 298.73 46.04C299.99 40.66 301.3 35.29 302.59 29.92C302.66 29.61 302.73 29.3 302.86 28.75H291.69C269.15 28.5633 246.607 28.3666 224.06 28.16C201.78 27.9333 179.497 27.71 157.21 27.49Z"
              className="text-amber-500"
              fill="currentColor"
            />
            <path
              // S
              d="M134.22 72.84C137.119 75.0813 139.52 77.901 141.27 81.12C142.838 83.8303 143.88 86.8127 144.34 89.91C144.52 91.3832 144.61 92.8659 144.61 94.35C144.61 95.57 144.55 96.78 144.43 97.99C144.057 100.903 142.017 102.673 138.31 103.3L115.97 107.3C115.419 107.402 114.86 107.455 114.3 107.46C111.7 107.46 110.4 106.06 110.4 103.26C110.453 101.731 110.134 100.212 109.473 98.8333C108.811 97.4541 107.825 96.2556 106.6 95.34C104.053 93.3867 100.587 92.41 96.2 92.41C93.02 92.3142 89.875 93.0961 87.11 94.67C84.59 96.17 83.33 97.9 83.33 99.86C83.33 101.82 84.8034 103.66 87.75 105.38C91.2354 107.325 94.9243 108.881 98.75 110.02C103.469 111.529 108.079 113.356 112.55 115.49C117.107 117.596 121.496 120.047 125.68 122.82C133.56 128.13 136.89 139.45 136.56 144.66C136.23 149.87 139.85 181.22 93.85 180.87C72.07 180.71 28.48 180.77 6.22003 180.77C3.18003 180.77 1.58004 181.19 0.0400391 177.66L0.240036 155.18C2.66004 152.69 1.26003 152.54 7.08003 152.64C31.31 153.03 92.44 153.9 95.2 152.4C98.47 150.57 100.14 148.56 100.2 146.4C100.2 144.3 98.65 142.3 95.55 140.4C92.1844 138.42 88.569 136.9 84.8 135.88C80.2457 134.506 75.7862 132.836 71.45 130.88C67.0482 128.955 62.8108 126.674 58.78 124.06C55.6044 121.953 53.006 119.085 51.2211 115.718C49.4362 112.351 48.5214 108.591 48.56 104.78C48.5739 102.543 48.8254 100.314 49.31 98.13C49.6701 96.2897 50.1955 94.4858 50.88 92.74C52.171 89.7204 53.8519 86.8829 55.88 84.3C58.5024 80.7453 61.6053 77.5717 65.1 74.87C68.72 72.0433 73.76 69.61 80.22 67.57C87.2359 65.4571 94.5335 64.4286 101.86 64.52C108.464 64.4097 115.052 65.2243 121.43 66.94C126.983 68.5533 131.247 70.52 134.22 72.84Z"
              fill="currentColor"
            />
            <path
              // K
              d="M216.3 177.41L199.06 146.6C198.44 145.54 197.55 145.54 196.37 146.64L186.69 155.73C186.127 156.27 185.741 156.967 185.58 157.73L181.85 175.83C181.22 179.05 179 180.66 175.16 180.66H153.44C150.16 180.66 148.55 179.473 148.61 177.1C148.614 176.675 148.644 176.251 148.7 175.83L170.21 71.94C170.957 68.7133 173.153 67.0767 176.8 67.03H198.53C201.81 67.03 203.45 68.1933 203.45 70.52C203.444 71.0025 203.38 71.4826 203.26 71.95L196.55 104.51C196.43 105.26 196.59 105.72 197.06 105.91C197.53 106.1 198.07 105.88 198.68 105.24L235.68 70.15C236.635 69.1509 237.786 68.3606 239.061 67.8287C240.337 67.2969 241.708 67.0351 243.09 67.06H271.19C273.603 67.06 275.023 67.64 275.45 68.8C275.569 69.0467 275.634 69.3161 275.64 69.59C275.64 70.6 274.99 71.76 273.69 73.08L226.03 118.23C225.17 119.08 224.98 119.82 225.48 120.45L255.61 174.8C256.6 176.44 256.63 177.82 255.7 178.96C254.78 180.093 253.173 180.66 250.88 180.66H222.42C219.507 180.667 217.467 179.583 216.3 177.41Z"
              fill="currentColor"
            />
            <path
              // I
              d="M299.73 67.06H320.63C323.89 67.11 325.55 68.27 325.53 70.53C325.526 71.0076 325.473 71.4835 325.37 71.95L303.86 175.82C303.247 179.04 301.057 180.65 297.29 180.65H276.38C273.173 180.65 271.57 179.463 271.57 177.09C271.574 176.669 271.604 176.248 271.66 175.83L293.17 71.97C293.91 68.69 296.1 67.06 299.73 67.06Z"
              fill="currentColor"
            />
            <path
              // L
              d="M417.79 157.61L413.99 175.83C413.44 179.05 411.21 180.66 407.28 180.66H332.28C329.067 180.66 327.46 179.473 327.46 177.1C327.464 176.675 327.494 176.251 327.55 175.83L349.09 71.95C349.84 68.67 352.03 67.04 355.68 67.04H377C380.28 67.09 381.91 68.25 381.91 70.52C381.903 71.0019 381.843 71.4815 381.73 71.95L366.15 147.86C366.034 148.355 365.974 148.862 365.97 149.37C365.97 151.64 367.54 152.77 370.7 152.77H413.07C416.343 152.77 417.98 153.907 417.98 156.18C417.974 156.663 417.91 157.143 417.79 157.61Z"
              fill="currentColor"
            />
            <path
              // L
              d="M546.37 152.77C550.29 152.77 552.79 152.02 552.66 156.02L553.24 177.96C551.76 180.98 553.93 180.98 545.67 180.66H435.15C431.937 180.66 430.33 179.473 430.33 177.1C430.334 176.675 430.364 176.251 430.42 175.83L451.97 71.95C452.71 68.67 454.91 67.04 458.55 67.04H479.82C483.093 67.0867 484.73 68.2467 484.73 70.52C484.723 71.0019 484.663 71.4815 484.55 71.95L469.01 147.86C468.894 148.355 468.834 148.862 468.83 149.37C468.83 151.637 470.403 152.77 473.55 152.77H546.37Z"
              fill="currentColor"
            />

            <path
              // RECORDINGS
              d="M89.8499 247.5C89.7862 247.377 89.7694 247.235 89.8025 247.101C89.8356 246.967 89.9164 246.849 90.0299 246.77C93.2999 244.65 94.7099 241.02 94.7099 235.82C94.7099 226.66 90.2799 222.41 79.3199 222.41H65.8399C65.5993 222.391 65.3573 222.421 65.1289 222.499C64.9004 222.577 64.6902 222.701 64.5114 222.863C64.3325 223.025 64.1886 223.222 64.0886 223.441C63.9886 223.661 63.9346 223.899 63.9299 224.14V259.79C63.9346 260.031 63.9886 260.269 64.0886 260.489C64.1886 260.709 64.3325 260.905 64.5114 261.067C64.6902 261.229 64.9004 261.353 65.1289 261.431C65.3573 261.509 65.5993 261.539 65.8399 261.52H72.7399C72.98 261.539 73.2215 261.509 73.4495 261.431C73.6774 261.353 73.8869 261.229 74.065 261.067C74.2431 260.905 74.3861 260.708 74.485 260.488C74.5838 260.268 74.6366 260.031 74.6399 259.79V250.95C74.6446 250.709 74.6986 250.471 74.7986 250.251C74.8986 250.032 75.0425 249.835 75.2214 249.673C75.4003 249.511 75.6104 249.387 75.8389 249.309C76.0673 249.231 76.3093 249.201 76.5499 249.22H79.0199C79.1174 249.227 79.2121 249.256 79.2969 249.304C79.3817 249.353 79.4546 249.42 79.5099 249.5L85.9099 260.73C86.0499 260.98 86.2572 261.186 86.5082 261.323C86.7592 261.461 87.044 261.526 87.3299 261.51H94.3299C96.2399 261.51 97.2299 259.95 96.3299 258.51L89.8499 247.5ZM79.6899 239.62H76.5499C76.3093 239.639 76.0673 239.609 75.8389 239.531C75.6104 239.453 75.4003 239.329 75.2214 239.167C75.0425 239.005 74.8986 238.809 74.7986 238.589C74.6986 238.369 74.6446 238.131 74.6399 237.89V233.75C74.6446 233.509 74.6986 233.271 74.7986 233.051C74.8986 232.832 75.0425 232.635 75.2214 232.473C75.4003 232.311 75.6104 232.187 75.8389 232.109C76.0673 232.031 76.3093 232.001 76.5499 232.02H79.6899C82.6899 232.02 84.1199 232.36 84.1199 235.82C84.1199 239.28 82.6499 239.62 79.6899 239.62ZM137.99 222.41H112.13C110.96 222.41 110.29 222.97 110.29 224.09V259.84C110.29 260.91 110.96 261.52 112.13 261.52H137.99C139.22 261.52 139.84 260.96 139.84 259.84V253.59C139.84 252.47 139.22 251.91 137.99 251.91H123.09C121.92 251.91 121.24 251.3 121.24 250.23V248.45C121.24 247.33 121.92 246.77 123.09 246.77H132.63C133.86 246.77 134.48 246.16 134.48 245.09V238.84C134.48 237.72 133.86 237.16 132.63 237.16H123.09C121.92 237.16 121.24 236.55 121.24 235.48V233.7C121.24 232.58 121.92 232.02 123.09 232.02H137.99C139.22 232.02 139.84 231.41 139.84 230.34V224.09C139.84 222.95 139.22 222.41 137.99 222.41ZM169.26 231.01C172.59 231.01 173.69 232.47 174 234.93C174.03 235.213 174.121 235.486 174.265 235.732C174.41 235.977 174.605 236.189 174.838 236.352C175.071 236.516 175.336 236.628 175.616 236.681C175.895 236.734 176.183 236.727 176.46 236.66L183.3 235.26C183.682 235.222 184.035 235.039 184.286 234.749C184.537 234.459 184.667 234.083 184.65 233.7C184.4 229.39 182.37 221.4 169.26 221.4C154.67 221.4 153.81 231.29 153.81 234.98V248.98C153.81 252.67 154.67 262.56 169.26 262.56C182.37 262.56 184.4 254.56 184.65 250.32C184.678 249.928 184.553 249.54 184.302 249.238C184.05 248.936 183.691 248.743 183.3 248.7L176.3 247.3C176.035 247.226 175.756 247.21 175.485 247.254C175.213 247.298 174.954 247.401 174.725 247.555C174.497 247.709 174.305 247.911 174.162 248.147C174.02 248.382 173.93 248.646 173.9 248.92C173.53 251.49 172.61 252.92 169.22 252.92C164.67 252.92 164.36 250.29 164.36 245.99V237.95C164.4 233.64 164.71 231.01 169.26 231.01ZM213.55 221.4C198.96 221.4 198.1 231.29 198.1 234.98V248.98C198.1 252.67 198.96 262.56 213.55 262.56C228.14 262.56 229.01 252.67 229.01 248.98V234.95C229.04 231.29 228.17 221.4 213.55 221.4ZM218.45 245.95C218.45 250.25 218.14 252.88 213.58 252.88C209.02 252.88 208.72 250.25 208.72 245.95V237.95C208.72 233.65 209.03 231.02 213.58 231.02C218.13 231.02 218.45 233.65 218.45 237.95V245.95ZM270.34 247.46C270.275 247.337 270.258 247.193 270.294 247.058C270.329 246.923 270.413 246.806 270.53 246.73C273.79 244.61 275.2 240.98 275.2 235.78C275.2 226.62 270.77 222.37 259.81 222.37H246.33C246.089 222.351 245.847 222.381 245.619 222.459C245.39 222.537 245.18 222.661 245.001 222.823C244.822 222.985 244.679 223.182 244.579 223.401C244.479 223.621 244.425 223.859 244.42 224.1V259.75C244.425 259.991 244.479 260.229 244.579 260.449C244.679 260.669 244.822 260.865 245.001 261.027C245.18 261.19 245.39 261.313 245.619 261.391C245.847 261.469 246.089 261.499 246.33 261.48H253.23C253.471 261.499 253.713 261.469 253.941 261.391C254.169 261.313 254.38 261.19 254.559 261.027C254.737 260.865 254.881 260.669 254.981 260.449C255.081 260.229 255.135 259.991 255.14 259.75V250.95C255.143 250.709 255.196 250.472 255.295 250.252C255.394 250.032 255.537 249.835 255.715 249.673C255.893 249.511 256.102 249.387 256.33 249.309C256.558 249.231 256.8 249.201 257.04 249.22H259.55C259.648 249.225 259.743 249.253 259.828 249.302C259.913 249.351 259.986 249.418 260.04 249.5L266.44 260.73C266.58 260.98 266.787 261.186 267.038 261.323C267.289 261.461 267.574 261.526 267.86 261.51H274.86C276.77 261.51 277.76 259.95 276.86 258.51L270.34 247.46ZM260.18 239.58H257.04C256.8 239.599 256.558 239.569 256.33 239.491C256.102 239.413 255.893 239.289 255.715 239.127C255.537 238.965 255.394 238.768 255.295 238.548C255.196 238.328 255.143 238.091 255.14 237.85V233.75C255.143 233.509 255.196 233.272 255.295 233.052C255.394 232.832 255.537 232.635 255.715 232.473C255.893 232.311 256.102 232.187 256.33 232.109C256.558 232.031 256.8 232.001 257.04 232.02H260.18C263.18 232.02 264.62 232.36 264.62 235.82C264.62 239.28 263.14 239.62 260.18 239.62V239.58ZM306.35 222.37H292.63C291.39 222.37 290.78 222.99 290.78 224.1V259.8C290.78 260.87 291.46 261.48 292.63 261.48H306.35C317.93 261.48 321.74 257.18 321.74 248.02V235.82C321.74 226.66 317.93 222.41 306.35 222.41V222.37ZM310.97 248.07C310.97 251.42 309.49 251.87 306.54 251.87H303.21C302.04 251.87 301.37 251.26 301.37 250.19V233.7C301.37 232.58 302.04 232.02 303.21 232.02H306.55C309.5 232.02 310.98 232.36 310.98 235.82L310.97 248.07ZM345.75 222.37H338.98C337.81 222.37 337.13 222.93 337.13 224.05V259.8C337.13 260.87 337.81 261.48 338.98 261.48H345.75C346.98 261.48 347.6 260.87 347.6 259.8V224.09C347.6 222.95 346.98 222.41 345.75 222.41V222.37ZM394.51 222.37H387.61C386.44 222.37 385.76 222.93 385.76 224.05V242.05C385.76 242.61 385.27 242.72 385.03 242.22L376.65 223.62C376.474 223.205 376.171 222.857 375.785 222.625C375.399 222.393 374.949 222.29 374.5 222.33H365.45C364.28 222.33 363.6 222.89 363.6 224.01V259.76C363.6 260.83 364.28 261.44 365.45 261.44H372.34C373.58 261.44 374.19 260.83 374.19 259.76V241.76C374.19 241.2 374.68 241.09 374.93 241.59L383.3 260.2C383.479 260.614 383.785 260.96 384.172 261.19C384.56 261.42 385.011 261.521 385.46 261.48H394.55C395.78 261.48 396.39 260.87 396.39 259.8V224.09C396.35 222.95 395.74 222.41 394.55 222.41L394.51 222.37ZM440.8 239.69H428.49C427.32 239.69 426.64 240.25 426.64 241.37V245.84C426.64 246.9 427.32 247.51 428.49 247.51H432.06C432.06 250.25 431.75 252.88 427.19 252.88C422.63 252.88 422.33 250.25 422.33 245.95V237.95C422.33 233.65 422.64 231.02 427.19 231.02C430.7 231.02 431.75 232.59 431.99 235.27C432.12 236.44 432.8 236.95 433.99 236.72L440.94 235.33C442.05 235.1 442.6 234.49 442.54 233.48C442.24 229.13 440.08 221.41 427.15 221.41C412.56 221.41 411.7 231.3 411.7 234.99V248.99C411.7 252.68 412.56 262.57 427.15 262.57C441.74 262.57 442.6 252.68 442.6 248.99V241.45C442.64 240.29 442.03 239.73 440.8 239.73V239.69ZM468.38 233.69C468.13 232.4 469.61 231.12 472.01 231.12C474.9 231.12 476.93 232.57 477.36 234.86C477.366 235.097 477.428 235.33 477.541 235.539C477.653 235.747 477.813 235.927 478.008 236.063C478.202 236.199 478.426 236.288 478.66 236.322C478.895 236.356 479.135 236.335 479.36 236.26L486.36 234.86C487.47 234.64 488.03 234.02 487.96 233.02C487.59 229.02 484.64 221.51 471.96 221.51C458.17 221.51 457.06 231.4 457.12 233.07C457.12 245.92 475.65 244.86 476.82 249.61C477.19 251.12 474.97 252.74 471.96 252.74C468.95 252.74 466.79 251.17 466.54 248.49C466.42 247.32 465.74 246.82 464.54 247.04L457.54 248.44C456.44 248.66 455.88 249.27 455.94 250.28C456.25 254.64 459.02 262.35 471.94 262.35C486.53 262.35 488.62 252.46 488.62 250.78C488.69 237.95 469.24 238.05 468.38 233.7V233.69Z"
              fill="currentColor"
              className="dark:text-gray-300 text-gray-700"
            />
          </svg>
          <span className="sr-only">Skill Recordings</span>
        </a>
      </Link>
      <div className="flex items-center absolute lg:right-8 sm:right-5 right-3">
        {mounted && (
          <>
            <motion.button
              role="switch"
              aria-checked={currentLight}
              type="button"
              className={`dark:bg-gray-700 bg-gray-200 w-8 h-5 rounded-full flex items-center relative `}
              onClick={() => {
                setTheme(nextTheme)
              }}
            >
              <motion.div
                initial={{
                  left: currentLight ? 0 : 12,
                }}
                animate={{
                  left: currentLight ? 0 : 12,
                }}
                aria-hidden
                className={`overflow-hidden w-5 h-5 p-1 flex items-center justify-center rounded-full dark:bg-gray-100 bg-gray-900 absolute dark:text-black text-white`}
              >
                <motion.svg
                  animate={{x: currentLight ? -16 : 0}}
                  // animate={{x: currentLight ? [-16, 0] : [0, -16]}}
                  transition={{duration: 0.2, type: 'spring'}}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute p-1.5"
                >
                  <path
                    d="M15.292 10.586C13.8105 11.2561 12.16 11.4589 10.5604 11.1673C8.96077 10.8757 7.48797 10.1036 6.33822 8.95382C5.18847 7.80407 4.41636 6.33127 4.12476 4.73163C3.83317 3.132 4.03593 1.48149 4.70604 0C3.5266 0.533011 2.49407 1.3442 1.69704 2.36396C0.90001 3.38372 0.362268 4.58162 0.129948 5.85489C-0.102372 7.12815 -0.022333 8.43877 0.363198 9.6743C0.748728 10.9098 1.42824 12.0334 2.34344 12.9486C3.25864 13.8638 4.3822 14.5433 5.61773 14.9288C6.85327 15.3144 8.16389 15.3944 9.43715 15.1621C10.7104 14.9298 11.9083 14.392 12.9281 13.595C13.9478 12.798 14.759 11.7654 15.292 10.586V10.586Z"
                    fill="currentColor"
                  />
                </motion.svg>
                <motion.svg
                  animate={{x: currentLight ? 0 : 16}}
                  // animate={{x: currentLight ? [0, 16] : [16, 0]}}
                  transition={{duration: 0.2, type: 'spring'}}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute p-1.5"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0C8.26522 0 8.51957 0.105357 8.70711 0.292893C8.89464 0.48043 9 0.734784 9 1V2C9 2.26522 8.89464 2.51957 8.70711 2.70711C8.51957 2.89464 8.26522 3 8 3C7.73478 3 7.48043 2.89464 7.29289 2.70711C7.10536 2.51957 7 2.26522 7 2V1C7 0.734784 7.10536 0.48043 7.29289 0.292893C7.48043 0.105357 7.73478 0 8 0V0ZM12 8C12 9.06087 11.5786 10.0783 10.8284 10.8284C10.0783 11.5786 9.06087 12 8 12C6.93913 12 5.92172 11.5786 5.17157 10.8284C4.42143 10.0783 4 9.06087 4 8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4C9.06087 4 10.0783 4.42143 10.8284 5.17157C11.5786 5.92172 12 6.93913 12 8V8ZM11.536 12.95L12.243 13.657C12.4316 13.8392 12.6842 13.94 12.9464 13.9377C13.2086 13.9354 13.4594 13.8302 13.6448 13.6448C13.8302 13.4594 13.9354 13.2086 13.9377 12.9464C13.94 12.6842 13.8392 12.4316 13.657 12.243L12.95 11.536C12.7614 11.3538 12.5088 11.253 12.2466 11.2553C11.9844 11.2576 11.7336 11.3628 11.5482 11.5482C11.3628 11.7336 11.2576 11.9844 11.2553 12.2466C11.253 12.5088 11.3538 12.7614 11.536 12.95V12.95ZM13.656 2.343C13.8435 2.53053 13.9488 2.78484 13.9488 3.05C13.9488 3.31516 13.8435 3.56947 13.656 3.757L12.95 4.464C12.8578 4.55951 12.7474 4.63569 12.6254 4.6881C12.5034 4.74051 12.3722 4.7681 12.2394 4.76925C12.1066 4.7704 11.9749 4.7451 11.852 4.69482C11.7291 4.64454 11.6175 4.57029 11.5236 4.4764C11.4297 4.3825 11.3555 4.27085 11.3052 4.14795C11.2549 4.02506 11.2296 3.89338 11.2307 3.7606C11.2319 3.62782 11.2595 3.4966 11.3119 3.3746C11.3643 3.25259 11.4405 3.14225 11.536 3.05L12.243 2.343C12.4305 2.15553 12.6848 2.05021 12.95 2.05021C13.2152 2.05021 13.4695 2.15553 13.657 2.343H13.656ZM15 9C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7H14C13.7348 7 13.4804 7.10536 13.2929 7.29289C13.1054 7.48043 13 7.73478 13 8C13 8.26522 13.1054 8.51957 13.2929 8.70711C13.4804 8.89464 13.7348 9 14 9H15ZM8 13C8.26522 13 8.51957 13.1054 8.70711 13.2929C8.89464 13.4804 9 13.7348 9 14V15C9 15.2652 8.89464 15.5196 8.70711 15.7071C8.51957 15.8946 8.26522 16 8 16C7.73478 16 7.48043 15.8946 7.29289 15.7071C7.10536 15.5196 7 15.2652 7 15V14C7 13.7348 7.10536 13.4804 7.29289 13.2929C7.48043 13.1054 7.73478 13 8 13V13ZM3.05 4.464C3.14284 4.55691 3.25308 4.63062 3.37441 4.68093C3.49574 4.73124 3.6258 4.75716 3.75715 4.7572C3.88849 4.75725 4.01857 4.73142 4.13993 4.6812C4.2613 4.63098 4.37159 4.55734 4.4645 4.4645C4.55741 4.37166 4.63112 4.26142 4.68143 4.14009C4.73174 4.01876 4.75766 3.8887 4.7577 3.75735C4.75775 3.62601 4.73192 3.49593 4.6817 3.37457C4.63148 3.2532 4.55784 3.14291 4.465 3.05L3.757 2.343C3.5684 2.16084 3.3158 2.06005 3.0536 2.06233C2.7914 2.0646 2.54059 2.16977 2.35518 2.35518C2.16977 2.54059 2.0646 2.7914 2.06233 3.0536C2.06005 3.3158 2.16084 3.5684 2.343 3.757L3.05 4.464V4.464ZM4.464 12.95L3.757 13.657C3.5684 13.8392 3.3158 13.94 3.0536 13.9377C2.7914 13.9354 2.54059 13.8302 2.35518 13.6448C2.16977 13.4594 2.0646 13.2086 2.06233 12.9464C2.06005 12.6842 2.16084 12.4316 2.343 12.243L3.05 11.536C3.2386 11.3538 3.4912 11.253 3.7534 11.2553C4.0156 11.2576 4.26641 11.3628 4.45182 11.5482C4.63723 11.7336 4.7424 11.9844 4.74467 12.2466C4.74695 12.5088 4.64616 12.7614 4.464 12.95V12.95ZM2 9C2.26522 9 2.51957 8.89464 2.70711 8.70711C2.89464 8.51957 3 8.26522 3 8C3 7.73478 2.89464 7.48043 2.70711 7.29289C2.51957 7.10536 2.26522 7 2 7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H2Z"
                    fill="currentColor"
                  />
                </motion.svg>
              </motion.div>
              <span className="sr-only">Activate {nextTheme} theme</span>
            </motion.button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navigation
