import { useEffect, useMemo, useState } from 'preact/hooks';
import { m4k } from '@common/m4k';
import { stringify, toError, withTimeout } from '@common/utils';
import { Button, Field, Form, Grid, Page, PageBody, Toolbar } from '@common/components';
import { GridCols } from '@common/components/Grid';

interface TestResult {
  success?: true;
  error?: string;
  value?: any;
  ms?: number;
}

interface TestData {
  name: string;
  getResult: () => Promise<TestResult>;
  expect: any;
  result?: TestResult;
}

const initTests = (): TestData[] => {
  // const testKey: 'test' = 'test';
  const testString = '{}()[]<>\n\té&"è^$€\'"';
  // const testObject = { a: [{}, [1, 5.2], testString] };
  const dir = `app/test`;
  const b64Name = '_b64';
  const b64Path = `${dir}/${b64Name}`;
  const cpPath = `${b64Path}Cp`;
  const utf8Name = '_utf8';
  const utf8Path = `${dir}/${utf8Name}`;

  const t = <T extends any>(
    name: string,
    fun: () => Promise<T> | T,
    expect?: T | ((result: T) => boolean)
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
      } catch (error) {
        return { error: toError(error).message, value };
      }
    };
    return { name, getResult, expect };
  };

  return [
    t('js1', () => m4k.evalJs('1+1'), { success: true, value: 2 }),
    t('js2', () => m4k.evalJs('"abc" + "def"'), { success: true, value: 'abcdef' }),
    t('js3', () => m4k.evalJs('Promise.resolve({ ok: 1 })'), { success: true, value: { ok: 1 } }),
    t('js4', () => m4k.evalJs('() => { throw new Error("test") }'), {
      success: false,
      error: 'Error: test',
    }),
    t('js5', () => m4k.evalJs('() => { return 5 }'), { success: true, value: 5 }),
    t(
      'su',
      () => m4k.su('echo "abc"'),
      (r) => r.code === 0
    ),
    t(
      'sh',
      () => m4k.sh('echo "abc"'),
      (r) => r.code === 0
    ),
    t('mkdir', () => m4k.mkdir(dir)),
    t(
      'file',
      () => m4k.fileInfo(dir),
      (i) => i.type === 'dir'
    ),
    t('write', () => m4k.write(b64Path, btoa('abc'), 'base64')),
    t('read', () => m4k.read(b64Path, 'base64'), btoa('abc')),
    t('write2', () => m4k.write(utf8Path, testString, 'utf8')),
    t('read2', () => m4k.read(utf8Path, 'utf8'), testString),
    t(
      'fetch file',
      () =>
        m4k
          .url(utf8Path)
          .then(fetch)
          .then((r) => r.text()),
      testString
    ), // m4k.read(utf8Path, 'utf8'), testString), // m4k.url(utf8Path)
    t(
      'ls',
      () => m4k.ls(dir, false),
      (files) => files.indexOf(b64Name) !== -1
    ),
    t(
      'file2',
      () => m4k.fileInfo(b64Path),
      (i) => i.type === 'file'
    ),
    t('cp', () => m4k.cp(b64Path, cpPath)),
    t(
      'file3',
      () => m4k.fileInfo(b64Path),
      (i) => i.type === 'file'
    ),
    t(
      'file3',
      () => m4k.fileInfo(cpPath),
      (i) => i.type === 'file'
    ),
    t('rm', () => m4k.rm(cpPath)),
    t('cp', () => m4k.mv(b64Path, cpPath)),
    t(
      'file3',
      () => m4k.fileInfo(b64Path),
      (i) => i.type === ''
    ),
    t(
      'file3',
      () => m4k.fileInfo(cpPath),
      (i) => i.type === 'file'
    ),
    t('rm2', () => m4k.rm(dir)),
    t(
      'file3',
      () => m4k.fileInfo(dir),
      (i) => i.type === ''
    ),
  ];
};

const showValue = (value: any) => {
  const type = typeof value;
  switch (type) {
    case 'function':
      return String(value);
    case 'undefined':
      return 'undefined';
    case 'object':
      return JSON.stringify(value);
    case 'string':
      return '"' + String(value).split('\n').join('\\n') + '"';
  }
  return `${value}(${type})`;
};

const testCols: GridCols<TestData, { currentIndex: number }> = {
  name: ['Nom', (test) => test.name],
  duration: ['Durée', (test) => `${test.result?.ms || 0}ms`],
  value: ['Valeur', (test) => showValue(test.result?.value)],
  expected: ['Attendue', (test) => showValue(test.expect)],
  error: ['Erreur', (test) => test.result?.error || ''],
};

export const TestPage = () => {
  const [script, setScript] = useState('');
  const [type, setType] = useState('');
  const [result, setResult] = useState<any>(null);
  const tests = useMemo(() => initTests(), []);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleExec = async () => {
    console.debug('DebugPage handle');
    const result = await (() => {
      switch (type) {
        case 'su':
          return m4k.su(script);
        case 'sh':
          return m4k.sh(script);
        default:
          return m4k.evalJs(script);
      }
    })();
    setResult(result);
  };

  useEffect(() => {
    if (!tests) return;
    const index = currentIndex + 1;
    const current = tests[index];
    if (!current) return;

    withTimeout(current.getResult(), 3000)
      .then((result) => {
        current.result = result;
        setCurrentIndex(index);
      })
      .catch((error) => {
        current.result = error;
        setCurrentIndex(index);
      });
  }, [tests, currentIndex]);

  return (
    <Page>
      <Toolbar title="Test des fonctions" />
      <PageBody>
        <Form>
          <Field label="Script" required type="multiline" value={script} onValue={setScript} />
          <Field
            label="Type"
            type="select"
            value={type}
            onValue={setType}
            items={[
              ['js', 'JS'],
              ['su', 'SU'],
              ['sh', 'SH'],
            ]}
          />
          <Field
            label="Résultat"
            type="multiline"
            value={stringify(result, undefined, 2) || String(result)}
          />
          <Field
            label="Valeur"
            type="multiline"
            value={stringify(result?.value, undefined, 2) || String(result?.value)}
          />
          <Button onClick={handleExec}>Executer</Button>
        </Form>
        <Grid
          cols={testCols}
          ctx={{ currentIndex }}
          rowProps={(test, _, index) => {
            const result = test.result || {};
            const mode =
              currentIndex + 1 === index
                ? 'selected'
                : result.success
                  ? 'success'
                  : result.error
                    ? 'error'
                    : undefined;
            return { mode };
          }}
          items={tests || []}
        />
      </PageBody>
    </Page>
  );
};
