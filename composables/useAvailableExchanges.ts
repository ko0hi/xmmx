const useAvailableExchanges = () => {
  const availableExchanges = ['binanceusdm', 'binancecoinm']
  return {
    availableExchanges,
    exchangeSelectOptionsForNaiveUi: computed(() => availableExchanges.map(i => ({ label: i, value: i }))),
  }
}

export default useAvailableExchanges
