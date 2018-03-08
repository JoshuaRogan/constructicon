import Loading from '..'
import { css } from '../../../lib/css'
import { rhythm, colors } from '../../../lib/traits'

describe.only('Loading', () => {
  it('renders a simple loading animation', () => {
    const wrapper = mount(<Loading />)
    const component = wrapper.find('Loading')
    const span = wrapper.find('span')
    expect(component.length).to.eql(1)
    expect(span.length).to.eql(3)
  })

  it('allows us to set the dots color', () => {
    const wrapper = mount(<Loading color='secondary' />)
    const component = wrapper.find('Loading')
    const rule = utils.findRule(css.rules, component.prop('classNames').dot)
    expect(rule.css).to.contain(`background-color:${colors.secondary}`)
  })

  it('allows us to set the dots size', () => {
    const wrapper = mount(<Loading size={3} />)
    const component = wrapper.find('Loading')
    const rule = utils.findRule(css.rules, component.prop('classNames').dot)
    expect(rule.css).to.contain(`width:${rhythm(1.5)}`)
    expect(rule.css).to.contain(`height:${rhythm(1.5)}`)
  })

  it('allows us to set the animation duration', () => {
    const wrapper = mount(<Loading duration={400} />)
    const component = wrapper.find('Loading')
    const rule = utils.findRule(css.rules, component.prop('classNames').dot)
    expect(rule.css).to.contain(`animation-duration:400ms`)
  })

  it('allows us to set custom styles', () => {
    const wrapper = mount(<Loading styles={{ root: { height: '100px' } }} />)
    const component = wrapper.find('Loading')
    const rule = utils.findRule(css.rules, component.prop('classNames').root)
    expect(rule.css).to.contain(`height:100px`)
  })
})