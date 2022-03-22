env=$1
vusers=$2
resultsDir="results/$3/"
scriptFile=$4

if [ ! -d "$resultsDir" ]
then
    echo "File doesn't exist. Creating now"
    mkdir ./$resultsDir
    echo "File created"
else
    echo "File exists"
fi

k6 run -e env=$1 -e vusers=$2 -e result=$resultsDir --logformat json --console-output=$resultsDir/log-file.log --out json=$resultsDir/result_js.json --out csv=$resultsDir/result_csv.csv $scriptFile