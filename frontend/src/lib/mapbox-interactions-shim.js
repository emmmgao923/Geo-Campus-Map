// import mapboxgl from 'mapbox-gl'

// /**
//  * Mapbox GL addInteraction shim
//  * - Binds to a map event (default 'mousemove')
//  * - If no layer binding is provided, we synthesize e.feature by querying rendered features
//  * - By default it queries the 'campus-buildings-hit' layer (your hit layer),
//  *   but you can pass options.layerIds = ['layerA', 'layerB'] to override.
//  */
// if (!mapboxgl.Map.prototype.__hasInteractionShimV2) {
//   const proto = mapboxgl.Map.prototype

//   const REGISTRY = new WeakMap()

//   function ensureRegistry(map) {
//     let r = REGISTRY.get(map)
//     if (!r) { r = {}; REGISTRY.set(map, r) }
//     return r
//   }

//   proto.addInteraction = function addInteraction(name, options = {}) {
//     const type = options.type || 'mousemove'
//     const layerIds = options.layerIds && Array.isArray(options.layerIds)
//       ? options.layerIds
//       : ['campus-buildings-hit'] // sensible default for your code

//     const userHandler = options.handler || (() => {})

//     const wrapped = (e) => {
//       try {
//         let feature = null

//         // If we are not bound to a specific layer via map.on(type, layerId, cb),
//         // synthesize a feature by querying at the event point.
//         if (!e.feature) {
//           try {
//             const layersToQuery = layerIds.filter(id => this.getLayer(id))
//             if (layersToQuery.length) {
//               const feats = this.queryRenderedFeatures(e.point, { layers: layersToQuery })
//               if (feats && feats.length) feature = feats[0]
//             }
//           } catch (err) {
//             // noop, we’ll just pass null feature
//           }
//         }

//         // Call user handler with augmented event that includes .feature
//         userHandler(Object.assign({}, e, { feature }))
//       } catch (err) {
//         console.warn(`[interaction:${name}] handler error:`, err)
//       }
//     }

//     // Register and bind
//     const reg = ensureRegistry(this)
//     reg[name] = { type, layerIds, wrapped }

//     // Bind to map-level event (not per-layer), so we can always synthesize feature
//     this.on(type, wrapped)

//     console.info(`[interaction:${name}] added (type=${type}; queryLayers=${layerIds.join(',')})`)
//     return name
//   }

//   proto.removeInteraction = function removeInteraction(name) {
//     const reg = ensureRegistry(this)
//     const rec = reg[name]
//     if (!rec) return
//     this.off(rec.type, rec.wrapped)
//     delete reg[name]
//     console.info(`[interaction:${name}] removed`)
//   }

//   Object.defineProperty(proto, '__hasInteractionShimV2', {
//     value: true,
//     writable: false
//   })
// }
