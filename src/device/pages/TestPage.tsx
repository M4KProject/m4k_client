import { useEffect, useMemo, useState } from 'preact/hooks';
import { m4k } from '@common/m4k';
import { toErr } from '@common/helpers';
import { Cell, CellHeader, Page, PageBody, PageHeader, Row, Table, TableBody, TableHead } from '@common/components';

interface TestResult {
    success?: true,
    error?: string,
    value?: any,
    ms?: number,
}

interface TestData {
    name: string;
    getResult: () => Promise<TestResult>;
    expect: any;
    result?: TestResult;
}

const initTests = (): TestData[] => {
    const testKey: 'test' = 'test';
    const testString = '{}()[]<>\n\té&"è^$€\'\"';
    const testObject = { a: [{}, [1, 5.2], testString] };
    const dir = `app/test`;
    const b64Name = '_b64';
    const b64Path = `${dir}/${b64Name}`;
    const cpPath = `${b64Path}Cp`;
    const utf8Name = '_utf8';
    const utf8Path = `${dir}/${utf8Name}`;

    const t = <T extends any>(
        name: string,
        fun: () => Promise<T>|T,
        expect?: T|((result: T) => boolean)
    ) => {
        const getResult = async (): Promise<TestResult> => {
            let value: any = undefined;
            const started = Date.now();
            try {
                value = await fun();
                if (expect !== undefined) {
                    if (expect instanceof Function) {
                        if (!expect(value)) {
                            return { error: 'not expect result', value };
                        }
                    } else {
                        const resultJson = JSON.stringify(value);
                        const expectJson = JSON.stringify(expect);
                        if (resultJson !== expectJson) {
                            return { error: 'not expect value', value };
                        }
                    }
                }
                const ms = Date.now() - started;
                return { success: true, value, ms };
            }
            catch (error) {
                return { error: toErr(error).message, value };
            }
        };
        return { name, getResult, expect };
    };

    return [
        t('js1', () => m4k.js('1+1'), { success: true, value: 2 }),
        t('js2', () => m4k.js('"abc" + "def"'), { success: true, value: 'abcdef' }),
        t('js3', () => m4k.js('Promise.resolve({ ok: 1 })'), { success: true, value: { ok: 1 } }),
        t('js4', () => m4k.js('() => { throw new Error("test") }'), { success: false, error: 'Error: test' }),
        t('js5', () => m4k.js('() => { return 5 }'), { success: true, value: 5 }),
        t('su', () => m4k.su('echo "abc"'), r => r.code === 0),
        t('sh', () => m4k.sh('echo "abc"'), r => r.code === 0),
        t('set string', () => m4k.set(testKey, testString)),
        t('get string', () => m4k.get(testKey), testString),
        t('set number', () => m4k.set(testKey, 5)),
        t('get number', () => m4k.get(testKey), 5),
        t('set number 2', () => m4k.set(testKey, 1.4)),
        t('get number 2', () => m4k.get(testKey), 1.4),
        t('set object', () => m4k.set(testKey, testObject)),
        t('get object', () => m4k.get(testKey), testObject),
        t('save config', () => m4k.save()),
        t('load config', () => m4k.load()),
        t('get saved object', () => m4k.get(testKey), testObject),
        t('set undefined', () => m4k.set(testKey, undefined)),
        t('get undefined', () => m4k.get(testKey), undefined),
        t('mkdir', () => m4k.mkdir(dir)),
        t('file', () => m4k.fileInfo(dir), i => i.type === 'dir'),
        t('write', () => m4k.write(b64Path, btoa("abc"), 'base64')),
        t('read', () => m4k.read(b64Path, 'base64'), btoa("abc")),
        t('write2', () => m4k.write(utf8Path, testString, 'utf8')),
        t('read2', () => m4k.read(utf8Path, 'utf8'), testString),
        t('fetch file', () => m4k.url(utf8Path).then(fetch).then(r => r.text()), testString), // m4k.read(utf8Path, 'utf8'), testString), // m4k.url(utf8Path)
        t('ls', () => m4k.ls(dir, false), files => files.indexOf(b64Name) !== -1),
        t('file2', () => m4k.fileInfo(b64Path), i => i.type === 'file'),
        t('cp', () => m4k.cp(b64Path, cpPath)),
        t('file3', () => m4k.fileInfo(b64Path), i => i.type === 'file'),
        t('file3', () => m4k.fileInfo(cpPath), i => i.type === 'file'),
        t('rm', () => m4k.rm(cpPath)),
        t('cp', () => m4k.mv(b64Path, cpPath)),
        t('file3', () => m4k.fileInfo(b64Path), i => i.type === ''),
        t('file3', () => m4k.fileInfo(cpPath), i => i.type === 'file'),
        t('rm2', () => m4k.rm(dir)),
        t('file3', () => m4k.fileInfo(dir), i => i.type === ''),
    ];
}

const showValue = (value: any) => {
    const type = typeof value;
    switch (type) {
        case 'function': return String(value);
        case 'undefined': return 'undefined';
        case 'object': return JSON.stringify(value);
        case 'string': return '"' + String(value).split('\n').join('\\n') + '"';
    }
    return `${value}(${type})`;
}

const Test = ({ next, data } : { next: boolean, data: TestData }) => {
    const r = useMemo(() => {
        const result: TestResult = data.result || {};
        return {
            name: data.name,
            ms: result.ms,
            success: result.success || false,
            expect: showValue(data.expect),
            value: showValue(result.value),
            error: result.error || '',
        };
    }, [data.result]);
    
    return (
        <Row mode={
            r.success ? 'success' :
            r.error ? 'error' :
            next ? 'selected' :
            undefined
        }>
            <Cell>{r.name}</Cell>
            <Cell>{r.ms}ms</Cell>
            <Cell>{r.value}</Cell>
            <Cell>{r.expect}</Cell>
            <Cell>{r.error}</Cell>
        </Row>
    )
}

export const TestPage = () => {
    const tests = useMemo(() => initTests(), []);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        if (!tests) return
        const index = currentIndex + 1;
        const current = tests[index];
        if (!current) return;

        current.getResult().then(result => {
            current.result = result;
            setCurrentIndex(index);
        });
    }, [tests, currentIndex]);

    return (
        <Page>
            <PageHeader title="Test des fonctions" />
            <PageBody>
                <Table>
                    <TableHead>
                        <Row>
                            <CellHeader>Nom</CellHeader>
                            <CellHeader>Durée</CellHeader>
                            <CellHeader>Valeur</CellHeader>
                            <CellHeader>Attendue</CellHeader>
                            <CellHeader>Erreur</CellHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        {(tests||[]).map((test, i) => (
                            <Test key={i} next={(currentIndex+1)===i} data={test} />
                        ))}
                    </TableBody>
                </Table>
            </PageBody>
        </Page>
    )
}
