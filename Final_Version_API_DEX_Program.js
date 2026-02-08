const cache = {
    tokens: new Set(),
    boosts: new Set(),
};

async function fetchMultipleApiDataContinuously() {
    try {
        console.log('\x1b[36m%s\x1b[0m', 'Start the API request...');
        const response1 = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });
        const response2 = await fetch('https://api.dexscreener.com/token-boosts/latest/v1', {
            method: 'GET',
            headers: {},
        });
        if (response1.ok) {
            const data1 = await response1.json();
            const searchResults = data1.map(token => token.tokenAddress);
            if (searchResults && searchResults.length > 0) {
                searchResults.forEach(tokenAddress => {
                    if (!cache.tokens.has(tokenAddress)) {
                        cache.tokens.add(tokenAddress);
                        const timestamp = new Date().toLocaleTimeString();
                        console.log('\x1b[32m%s\x1b[0m', `#${timestamp} DEX PAID - CA (${tokenAddress})`);
                    }
                });
            } else {
                console.log('\x1b[33m%s\x1b[0m', 'No matching tokens found.');
            }
        } else {
            console.error('\x1b[31m%s\x1b[0m', `Error fetching tokens: ${response1.status} - ${response1.statusText}`);
        }
        if (response2.ok) {
            const data2 = await response2.json();
            const tokenBoosts = data2.map(boost => ({
                amount: boost.amount,
                totalAmount: boost.totalAmount,
                tokenAddress: boost.tokenAddress,
            }));
            if (tokenBoosts && tokenBoosts.length > 0) {
                tokenBoosts.forEach(boost => {
                    if (!cache.boosts.has(boost.tokenAddress)) {
                        cache.boosts.add(boost.tokenAddress);
                        const timestamp = new Date().toLocaleTimeString();
                        console.log(
                            `\x1b[34m#${timestamp} DEX BOOST - CA (${boost.tokenAddress})\x1b[0m` +
                            ` \x1b[35m--> TOTAL: ${boost.totalAmount}\x1b[0m` +
                            ` \x1b[32m; ADDED: ${boost.amount}\x1b[0m`
                        );
                    }
                });
            } else {
                console.log('\x1b[33m%s\x1b[0m', 'No token boosts found.');
            }
        } else {
            console.error('\x1b[31m%s\x1b[0m', `Error fetching token boosts: ${response2.status} - ${response2.statusText}`);
        }
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error during API request:', error);
    }
    setTimeout(fetchMultipleApiDataContinuously, 1000);
}
fetchMultipleApiDataContinuously();