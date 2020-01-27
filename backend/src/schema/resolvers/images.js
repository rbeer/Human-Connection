import Resolver from './helpers/Resolver'
export default {
  Image: {
    ...Resolver('Image', {
      undefinedToNull: ['blurred', 'alt', 'aspectRatio'],
    }),
  },
}
