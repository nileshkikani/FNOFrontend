// import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
// // import { useDispatch } from "react-redux"
// // import { byRecipeData } from "@reducers"
// import {
//   ArchiveBoxXMarkIcon,
//   ChevronDownIcon,
//   PencilIcon,
//   Square2StackIcon,
//   TrashIcon,
// } from '@heroicons/react/16/solid'
// import { useEffect, useState } from "react"
// import { useAppSelector } from "@/store";

// export function DropDown(props) {
//   const {
//     renderItem,
//     items,
//     defaultValue,
//     title,
//     disableTrigger = false,
//     onclick,
//   } = props
//   const [selected, setSelected] = useState(defaultValue)
// const authState = useAppSelector((state) => state.auth.authState);

//   useEffect(() => {
//     setSelected(defaultValue)
//   }, [defaultValue])
//   const setUserInput = (type, aValue) => {
//     if(!authState){
//      return
//     }
//     setSelected(aValue?.name)
//     onclick && onclick(aValue?.name)
   
//   }

//   return (
//     <Menu as="div" className="relative dropdown-parent">
//       <MenuButton className={"dropdown-btn"} disabled={disableTrigger}>
//         {selected && selected}
//         {/* <ChevronDownIcon className="size-4 fill-white/20" /> */}
//       </MenuButton>

//       {/* Use the Transition component.*/}
//       {items?.length > 0 && (
//         <Transition
//           enter="transition duration-100 ease-out"
//           enterFrom="transform scale-95 opacity-0"
//           enterTo="transform scale-100 opacity-100"
//           leave="transition duration-75 ease-out"
//           leaveFrom="transform scale-100 opacity-100"
//           leaveTo="transform scale-95 opacity-0"
//         >
//           <MenuItems className="absolute z-10 origin-top-right bg-white shadow-lg -right-3 w-52 rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none md:right-0 sortByFilterDrop">
//             {/* {title && <>{title}</>} */}
//             {items.map((item, i) => {
//               return (
//                 <MenuItem key={i}>
//                   {( active ) =>
//                     renderItem?.({
//                       item,
//                       isActive: active,
//                       onClick: setUserInput,
//                     })
//                   }
//                 </MenuItem>
//               )
//             })}
//           </MenuItems>
//         </Transition>
//       )}
//     </Menu>
//   )
// }
