import '@testing-library/jest-dom';

jest.mock('mapbox-gl', () => ({
  Map: class {
    on = jest.fn()
  },
  Marker: jest.fn().mockReturnValue({
    setLngLat: jest.fn().mockReturnValue({
      setPopup: jest.fn().mockReturnValue({
        addTo: jest.fn().mockReturnValue({})
      })
    })
  }),
  Popup: jest.fn().mockReturnValue({
    setHTML: jest.fn().mockReturnValue({ on: jest.fn() })
  })
}));




