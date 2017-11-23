import React from 'react'
import {
    Route,
    Link,
    Switch
} from 'react-router-dom'

import BasicLayout from '../layouts/BasicLayout.js'

function MiddleModel(a, b) {
    console.log(a)
    console.log(b)
    return (
        <div>aaa</div>
    )
}

// const Home = ({match, history, location, routes}) => {
//     return (
//         <div>
//             <ul>
//                 {
//                     routes.map((route, idx) => {
//                         if (route.routes) {
//                             return (
//                                 <li key={idx}>
//                                     <ol key={idx}>
//                                         {
//                                             route.routes.map((child, sn) => (
//                                                 <li key={`${idx}-${sn}`}>
//                                                     <Link to={`${match.path}${route.path}${child.path}`}>{child.name}</Link>
//                                                 </li>
//                                             ))
//                                         }
//                                     </ol>
//                                 </li>
//                             )
//                         } else {
//                             return (
//                                 <li key={idx}>
//                                     <Link to={`${match.path}${route.path}`}>{route.name}</Link>
//                                 </li>
//                             )
//                         }
//                     })
//                 }
//             </ul>
//             {
//                 routes.map((route, idx) => {
//                     if (route.routes) {
//                         return (
//                             <Switch key={idx}>
//                                 {
//                                     route.routes.map((child, sn) => {
//                                         return (
//                                             <Route
//                                                 key={`${idx}-${sn}`}
//                                                 exact={child.exact}
//                                                 path={`${match.path}${route.path}${child.path}`}
//                                                 render={props => (
//                                                     <child.component {...props} />
//                                                 )}
//                                             />
//                                         )
//                                     })
//                                 }
//                             </Switch>
//                         )
//                     } else {
//                         return (
//                             <Route
//                                 key={idx}
//                                 exact
//                                 path={`${match.path}${route.path}`}
//                                 component={MiddleModel}
//                             />
//                         )
//                     }
//                 })
//             }
//         </div>
//     )
// }

// const Home = ({match, history, location, routes}) => (
//     <BasicLayout routes={routes} match={match} location={location} history={history}>
//         {
//             routes.map((route, idx) => {
//                 if (route.routes) {
//                     return (
//                         <Switch key={idx}>
//                             {
//                                 route.routes.map((child, sn) => {
//                                     return (
//                                         <Route
//                                             key={`${idx}-${sn}`}
//                                             exact={child.exact}
//                                             path={`${match.path}${route.path}${child.path}`}
//                                             render={props => (
//                                                 <child.component {...props} />
//                                             )}
//                                         />
//                                     )
//                                 })
//                             }
//                         </Switch>
//                     )
//                 } else {
//                     return (
//                         <Route
//                             key={idx}
//                             exact
//                             path={`${match.path}${route.path}`}
//                             component={MiddleModel}
//                         />
//                     )
//                 }
//             })
//         }
//     </BasicLayout>
// )

class Home extends React.Component {
    render() {
        const match = this.props.match
        const history = this.props.history
        const location = this.props.location
        const routes = this.props.routes
        return (
            <BasicLayout {...this.props} />
        )
    }
}

export default Home
