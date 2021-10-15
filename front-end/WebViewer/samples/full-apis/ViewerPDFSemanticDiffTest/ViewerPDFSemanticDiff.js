(async exports => {
  const PDFNet = exports.Core.PDFNet;
  let Core = null;

  const parentDoc = window.parent.window.document;
  const uploadedDoc = [null, null];
  const recentDiffs = [];

  const compareDoc = async (doc1, doc2) => {
    const newDoc = await PDFNet.PDFDoc.create();
    newDoc.lock();

    await newDoc.appendTextDiffDoc(doc1, doc2);

    await newDoc.unlock();
    instance.UI.loadDocument(newDoc);

    recentDiffs.push([...uploadedDoc]);

    // Skip default comparison
    if (recentDiffs.length === 1) {
      return;
    }

    const recentElement = parentDoc.getElementById('recentFiles');
    const comparisonElement = document.createElement('button');
    comparisonElement.innerText = `Compare ${doc1.fileName} (A) & ${doc2.fileName} (B)`;
    comparisonElement.classList.add('link');
    comparisonElement.onclick = onClickRecentLink.bind({ idx: recentDiffs.length - 1 });
    recentElement.appendChild(comparisonElement);
  };

  const enableCompareButton = async () => {
    const compareButton = parentDoc.getElementById('compareButton');

    if (!compareButton.classList.contains('disabled')) {
      return;
    }

    compareButton.classList.remove('disabled');

    compareButton.addEventListener('click', async () => {
      const doc1 = uploadedDoc[0];
      const doc2 = uploadedDoc[1];
      await compareDoc(doc1, doc2);
    });
  };

  const getPDFDocFromUpload = async (file, fileIndex) => {
    const newDoc = await Core.createDocument(file, {});
    uploadedDoc[fileIndex] = await newDoc.getPDFDoc();
    uploadedDoc[fileIndex].fileName = file.name;
    if (uploadedDoc[1] !== null && uploadedDoc[0] !== null) {
      enableCompareButton();
    }
  };

  parentDoc.getElementById('fileUpload1').addEventListener('change', e => {
    getPDFDocFromUpload(e.target.files[0], 0);
  });

  parentDoc.getElementById('fileUpload2').addEventListener('change', e => {
    getPDFDocFromUpload(e.target.files[0], 1);
  });

  const onClickRecentLink = async function() {
    await compareDoc(recentDiffs[this.idx][0], recentDiffs[this.idx][1]);
  };

  const init = async () => {
    Core = window.Core;
    Core.enableFullPDF();
    await PDFNet.initialize();
    instance.docViewer.addEventListener('documentLoaded', () => {
      instance.UI.setLayoutMode(instance.UI.LayoutMode.FacingContinuous);
      instance.UI.openElements(['notesPanel']);
    });
  };

  window.addEventListener('viewerLoaded', async () => {
    await init();
    const doc1 = await PDFNet.PDFDoc.createFromURL('../../samples/files/semantic_test_doc_1.pdf');
    const doc2 = await PDFNet.PDFDoc.createFromURL('../../samples/files/semantic_test_doc_2.pdf');
    await compareDoc(doc1, doc2);

    parentDoc.getElementById('fileUpload1').disabled = false;
    parentDoc.getElementById('fileUpload2').disabled = false;
  });
})(window);
// eslint-disable-next-line spaced-comment
//# sourceURL=config.js
