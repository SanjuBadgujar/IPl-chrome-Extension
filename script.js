const iplScoreElement = document.getElementById('ipl-score');

async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=55664d01-3932-449b-a1f9-96bd640f6b71&offset=0");
        const data = await response.json();

        if (data.status !== "success") {
            console.error("API request failed.");
            return;
        }

        const matchesList = data.data;

        if (!matchesList || !Array.isArray(matchesList)) {
            console.error("Invalid data format received.");
            return;
        }

        const relevantMatches = matchesList.filter(match => match.series_id === "76ae85e2-88e5-4e99-83e4-5f352108aebc");
        
        if (relevantMatches.length === 0) {
            console.error("No relevant matches found.");
            return;
        }

        const relevantData = relevantMatches.map(match => {
            const { name, status, venue, dateTimeGMT, score } = match;
            const time = new Date(dateTimeGMT).toLocaleString();
            
            if (!score || !Array.isArray(score) || score.length < 2) {
                return `${name},<br>Status: ${status},<br>Venue: ${venue}<br>Time: ${time}<br>Score: Match data unavailable`;
            }

            const [inning1, inning2] = score.map(s => `${s.inning}: ${s.r}/${s.w} in ${s.o} overs`);
            return `${name},<br>Status: ${status},<br>Venue: ${venue}<br>Time: ${time}<br>Score: ${inning1}, ${inning2}`;
        });

        console.log({ relevantData });

        document.getElementById("matches").innerHTML = relevantData.map(match => `<li>${match}</li>`).join('');

        const [team] = relevantMatches.map(match => `${match.teamInfo[0].shortname} vs ${match.teamInfo[1].shortname}`);

        let score = "";
        const matchInProgress = relevantMatches.some(match => match.score);

        if (matchInProgress) {
            const [inning1, inning2] = relevantMatches[0].score.map(s => `${s.inning}: ${s.r}/${s.w} in ${s.o} overs`);
            score = `${inning1}, ${inning2}`;
        } else {
            score = "Match has not started yet!";
        }

        const [status] = relevantMatches.map(match => `${match.status}`);

        console.log({ team });

        iplScoreElement.querySelector('.team').textContent = team;
        iplScoreElement.querySelector('.score').textContent = score;
        iplScoreElement.querySelector('.status').textContent = status;

        return relevantData;
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

getMatchData();
